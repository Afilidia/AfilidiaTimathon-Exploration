let silnia = (n) => {
    let i = 1;
    let s = 1;
    while (i <= n) s *= i++;
    return s;
}