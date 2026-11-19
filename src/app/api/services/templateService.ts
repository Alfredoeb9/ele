// import path from "path"
// import Handlebars from "handlebars";
// import fs from "fs";

// export const createEmailTemplate = async (templateFile: string, payload: { fullName: string; content: string; title: string; button: string; subTxt: string; mainLink: string; }) => {
//   const source = fs.readFileSync(path.join(process.cwd(), `src/app/api/templates/${templateFile}`), {encoding: "utf8"} );
  
//   const template = Handlebars.compile(source);
//   return template(payload);
// }

export function createEmailTemplate(
  source: string,
  payload: Record<string, string>,
): string {
  return Object.entries(payload).reduce(
    (html, [key, value]) =>
      html.replaceAll(`{{${key}}}`, value),
    source,
  );
}
