export const getDataReport = async (dateStart: string, dateEnd: string, columns: string, valor: string) => {
    const resp = await fetch( `https://apitest.ikbo.co/sales?dateini=${dateStart}&datefin=${dateEnd}&columns[]=${columns}&columns[]=color&value=${valor}` );
    const data = await resp.json();
    return data;
}