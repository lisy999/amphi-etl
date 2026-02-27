import { editIcon } from "../../icons";
// import { BaseCoreComponent } from '../BaseCoreComponent';
import { BaseCoreComponent } from "../BaseCoreComponent";
import { chineseLabel } from "./label";

export class InlineInput extends BaseCoreComponent {
  constructor() {
    const inlineDataDefault: string = `First Name,Last Name,Age,🏅
John,Doe,28,🥇
Jane,Smith,34,🥈
Emily,Jones,45,🥉
Michael,Brown,22,🥉
Sarah,Wilson,30,🥇`;

    const defaultConfig = { inlineData: inlineDataDefault };
    const form = {
      idPrefix: "component__form",
      fields: [
        {
          type: "codeTextarea",
          label: "Inline Data",
          id: "inlineData",
          placeholder: "Enter your CSV data here",
          tooltip:
            "Type your CSV-like data directly. First line is header. For example:\nID,brand,criteria,assesement\n123,abc,Q9,Y\n145,abc,Q9,Y",
          aiInstructions:
            "Generate mock CSV-like data for demonstration purposes.\nIMPORTANT: Output only raw CSV text. Limit to 20 rows unless specified otherwise by the user.",
          aiGeneration: true,
          aiDataSample: false,
          aiPromptExamples: [
            {
              label: "Fake user data",
              value:
                "Generate fake user data with columns: id, name, email, signup_date.",
            },
            {
              label: "Product inventory",
              value:
                "Create product inventory with columns like product_id, name, quantity, and price.",
            },
            {
              label: "Mock order data",
              value:
                "Generate mock order data including order_id, user_id, product_id, quantity, and order_date.",
            },
            {
              label: "Survey results",
              value:
                "Generate fake survey results with respondent_id, question_id, and response.",
            },
          ],
          advanced: true,
        },
      ],
    };
    const description =
      "使用内联输入功能，您可以以类似 CSV 的格式手动输入数据，以便在流程中使用这些数据。";
    super(
      "内联输入",
      "inlineInput",
      description,
      "pandas_df_input",
      [],
      chineseLabel,
      editIcon,
      defaultConfig,
      form,
    );
  }

  private getEffectiveData(config: any): string {
    const rawValue = config.inlineData;
    if (!rawValue) return "";

    // If it's already an object
    if (typeof rawValue === "object") return rawValue.code || "";

    try {
      const parsed = JSON.parse(rawValue);
      // Even if the field ID is 'inlineData', CodeTextarea saves the text in 'code'
      if (parsed && typeof parsed === "object" && "code" in parsed) {
        return parsed.code;
      }
    } catch (e) {
      // Backward compatibility: value is just the raw CSV string
      return rawValue;
    }
    return rawValue;
  }

  public provideImports({ config }): string[] {
    return ["import pandas as pd", "from io import StringIO"];
  }

  public generateComponentCode({ config, outputName }): string {
    // 1. Extract the actual CSV content from the wrapper
    const effectiveData = this.getEffectiveData(config).trim();

    if (!effectiveData) {
      throw new Error("No inline data provided.");
    }

    // 2. Escape triple quotes in case the user's data contains them
    const escapedData = effectiveData.replace(/"""/g, '\\"""');

    // 3. Generate the Pandas loading code
    // We wrap the raw string in triple quotes and pass it to StringIO
    const code = `
${outputName}_data = """${escapedData}
"""
${outputName} = pd.read_csv(StringIO(${outputName}_data)).convert_dtypes()
`;
    return code;
  }
}
