import path from "path"
import Handlebars from "handlebars";
import fs from "fs";

export const createEmailTemplate = async (templateFile: string, payload: { fullName: string; content: string; title: string; button: string; subTxt: string; mainLink: string; }) => {
  const source = fs.readFileSync(path.join(process.cwd(), `src/app/api/templates/${templateFile}`), {encoding: "utf8"} );
  
  const template = Handlebars.compile(source);
  return template(payload);
}
