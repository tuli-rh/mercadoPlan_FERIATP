function unitPrice(finalPrice, normalized) {
    // sólidos en g → $/kg ; líquidos en ml → $/L ; sino → $/unidad
    if (normalized.unit === 'g') {
        const kg = normalized.size / 1000;
        return finalPrice / (kg || 1);
    }
    if (normalized.unit === 'ml') {
        const L = normalized.size / 1000;
        return finalPrice / (L || 1);
    }
    return finalPrice; // unidad
}
function formatUnit(value, unit) {
    if (unit === 'g') return `${clp(Math.round(value))} por kg`;
    if (unit === 'ml') return `${clp(Math.round(value))} por L`;
    return `${clp(Math.round(value))} por unidad`;
}
