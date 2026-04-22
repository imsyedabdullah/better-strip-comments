interface StripOptions {
    line?: boolean;
    block?: boolean;
    language?: string;
    keepProtected?: boolean;
    preserveNewlines?: boolean;
    safe?: boolean;
    first?: boolean;
}

interface StripFn {
    (input: string, options?: StripOptions): string;
    block(input: string, options?: StripOptions): string;
    line(input: string, options?: StripOptions): string;
    first(input: string, options?: StripOptions): string;
    parse(input: string, options?: StripOptions): unknown;
}

declare const strip: StripFn;
export = strip;