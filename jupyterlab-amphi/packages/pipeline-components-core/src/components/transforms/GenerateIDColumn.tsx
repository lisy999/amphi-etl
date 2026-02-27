import { numberIcon } from "../../icons";
import { BaseCoreComponent } from "../BaseCoreComponent"; // Adjust the import path
import { chineseLabel } from "../inputs/label";

export class GenerateIDColumn extends BaseCoreComponent {
  constructor() {
    const defaultConfig = {
      columnType: "int64",
      insertPosition: "first",
      startingValue: 1,
      rowIdName: "ID",
    };
    const form = {
      idPrefix: "component__form",
      fields: [
        {
          type: "inputNumber",
          label: "Starting Value",
          id: "startingValue",
          placeholder: "0",
          min: 0,
        },
        {
          type: "radio",
          label: "Insert Position",
          id: "insertPosition",
          options: [
            { value: "first", label: "First" },
            { value: "last", label: "Last" },
          ],
        },
        {
          type: "input",
          label: "Name",
          id: "rowIdName",
          placeholder: "default ID",
          tooltip:
            "you may want to change that if you want a special name or no upper case, or id is already taken",
          advanced: true,
        },
        {
          type: "selectCustomizable",
          label: "Column Type",
          id: "columnType",
          options: [
            { value: "int64", label: "int64", tooltip: "Integer (int64)" },
            { value: "float64", label: "float64", tooltip: "Float (float64)" },
          ],
          advanced: true,
        },
      ],
    };
    // const description = "Use Row ID to assign a unique identifier to each row in a dataset.";
    const description = "使用行标识来为数据集中的每一行分配一个唯一的标识符。";

    super(
      // "Row ID",
      "行标识",
      "generate_id_column",
      description,
      "pandas_df_processor",
      [],
      chineseLabel[1],
      numberIcon,
      defaultConfig,
      form,
    );
  }

  public provideImports({ config }): string[] {
    return ["import pandas as pd"];
  }

  public generateComponentCode({ config, inputName, outputName }): string {
    const prefix = config?.backend?.prefix ?? "pd";
    const startingValue = config.startingValue || 1;
    const columnType = config.columnType || "int64";
    const insertPosition = config.insertPosition || "last";
    //if null, undefined or empty
    const const_ts_rowidname =
      config.rowIdName && config.rowIdName.length > 0 ? config.rowIdName : "ID";
    const idColumn = `range(${startingValue}, ${startingValue} + len(${inputName}))`;
    const idColumnFirst = `['${const_ts_rowidname}'] + ${inputName}.columns.tolist()`;
    const idColumnLast = `${inputName}.columns.tolist() + ['${const_ts_rowidname}']`;

    const code = `
# Generate ID column
#copy the df
${outputName} = ${inputName}.copy()
#insert the new column with its type
${outputName}['${const_ts_rowidname}'] = ${prefix}.Series(${idColumn}, dtype='${columnType}')
#deal with the position
${outputName} = ${outputName}.reindex(columns=${
      insertPosition === "first" ? idColumnFirst : idColumnLast
    })
`;

    return code;
  }
}
