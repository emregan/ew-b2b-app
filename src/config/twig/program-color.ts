export default class ProgramColor {
    private hex: string;
    private customColor: string = "program-custom-color";

    constructor(private twig: any) {}

    public get(headerColor: string, customHeaderColor: string): string {
        const definedColor: string = headerColor;
        // even if color is define only allow it if valid hex
        this.hex = (customHeaderColor.length == 4 || customHeaderColor.length == 7) ?  customHeaderColor : undefined;

        return this.hex ? this.customColor : definedColor;
    }

    public setStyles(): string {
        if (this.hex) {
            return this.twig.filters.raw(`<style>
                .u-color-${this.customColor} { color: ${this.hex}; }
                .u-background-${this.customColor} { background-color: ${this.hex}; }
                .u-border-${this.customColor} { border-color: ${this.hex}; }
                .u-fill-${this.customColor} { fill: ${this.hex}; }
                .u-stroke-${this.customColor} { stroke: ${this.hex}; }
            </style>`);
        }
        return "";
    }
}
