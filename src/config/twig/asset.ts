import { join } from "path";
import * as logger from "../../services/logger";

export default class AssetsManifest {
  private jsManifest: any = {};
  private cssManifest: any = {};
  private jsRoot: string = join(__dirname, "../../public/js/manifest.json");
  private cssRoot: string = join(__dirname, "../../public/css/manifest.json");

  constructor () {
    if (process.env.NODE_ENV === "production") {
      this.getJsManifest();
      this.getCssManifest();
    }
  }

  private getJsManifest() {
    try {
      Object.assign(
        this.jsManifest,
        require(this.jsRoot)
      );
    } catch (e) {
      logger.warn(e.toString());
    }
  }

  private getCssManifest() {
    try {
      Object.assign(
        this.cssManifest,
        require(this.cssRoot)
      );
    } catch (e) {
      logger.warn(e.toString());
    }
  }

  public getJsFile(fileName: string): string {
    return this.jsManifest[fileName] || `/js/${fileName}.bundle.js?v=${new Date().getTime()}`;
  }

  public getCssFile(fileName: string): string {
    return this.cssManifest[fileName] || `/css/${fileName}.css?v=${new Date().getTime()}`;
  }
}
