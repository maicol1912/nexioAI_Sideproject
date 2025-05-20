// auto-map-fields.util.ts

export function autoMapFields<T extends object>(
    dto: T,
    model: any,
    options?: { toExclude?: string[] }
): void {
    console.log(options)
    const excludeFields = options?.toExclude || [];

    // Usamos Object.keys y casteamos correctamente
    const keys = Object.keys(dto) as Array<keyof T>;

    for (const key of keys) {
        if (excludeFields.includes(key as string)) continue;
        if (model && key in model) {
            (dto[key] as any) = model[key];
        }
    }
}