import { sortIcon } from "../../icons";
import { BaseCoreComponent } from "../BaseCoreComponent";
import { chineseLabel } from "../inputs/label";

export class Sort extends BaseCoreComponent {
  constructor() {
    const defaultConfig = { columnAndOrder: [] };
    const form = {
      idPrefix: "component__form",
      fields: [
        {
          type: "keyvalueColumnsRadio",
          label: "Columns Sorting Order",
          id: "columnAndOrder",
          options: [
            { value: "True", label: "Asc." },
            { value: "False", label: "Desc." },
          ],
        },
        {
          type: "boolean",
          label: "Ignore Index",
          id: "ignoreIndex",
          advanced: true,
        },
      ],
    };
    // const description = "Use Sort Rows to sort based on the values in columns. Values will be sorted by lexicographical order.";
    const description =
      "使用“按列排序”功能可依据列中的数值进行排序。排序方式将按照字母顺序进行。";

    super(
      // "Sort Rows",
      "按列排序",
      "sort",
      description,
      "pandas_df_processor",
      [],
      chineseLabel[1],
      sortIcon,
      defaultConfig,
      form,
    );
  }

  public provideImports({ config }): string[] {
    return [];
  }

  public generateComponentCode({ config, inputName, outputName }): string {
    const byColumns = `by=[${config.columnAndOrder
      .map((item) => (item.key.named ? `"${item.key.value}"` : item.key.value))
      .join(", ")}]`;
    const ascending = `ascending=[${config.columnAndOrder
      .map((item) => (item.value === "True" ? "True" : "False"))
      .join(", ")}]`;
    const ignoreIndex = config.ignoreIndex
      ? `, ignore_index=${config.ignoreIndex}`
      : "";

    const code = `
# Sort rows 
${outputName} = ${inputName}.sort_values(${byColumns}, ${ascending}${ignoreIndex})
`;
    return code;
  }
}
