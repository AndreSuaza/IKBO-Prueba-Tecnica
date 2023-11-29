import { Form, Formik } from "formik";
import { getDataReport } from "./services/report";
import { MultiSelect, DateSelect } from "./components/Form";
import { useState } from "react";
import { Report } from "./models/report.model";

function App() {

  const [dataReport, setDataReport] = useState<any[]>([]);
  const [dates, setDates] =  useState<string[]>([]);
  const [columnsReport, setColumnsReport] =  useState<any[]>([]);
  const [validations, setValidations] = useState<string>("");

  const columns = [
      {id: 1, value: "customer", label: "Cliente"}, 
      {id: 2, value: "country", label: "País"},
      {id: 3, value: "provider", label: "Proveedor"},
      {id: 4, value: "category", label: "Categoría de producto"},
      {id: 5, value: "variety", label: "Variedad"},
      {id: 6, value: "color", label: "Color"}];
  
  const valor = [{value: "stems", label: "Tallos"}, {value: "price", label: "Valor"}];

  function getUniqueDates(array: Report[]) {
      return Array.from(new Set(array.map((data:any) => data.date)));
  }

  const createReport = (data: Report[], fields: any[]) => {

    const dateBase:Report[] = [...data];
    const report:Report[] = [];

    dateBase.map((dato, i) => {

      const { date, stems, price, ...rest } = dato;

      let dates = {[data[i].date || ""]: data[i].stems ? data[i].stems : data[i].price};
      
      for (let index = i+1; index < dateBase.length; index++) {

        const { date, stems,  price, ...rest } = dateBase[index];

        if (JSON.stringify(dato) === JSON.stringify(dateBase[index])) {
          dates = {...dates, [data[index].date || ""]: data[index].stems ? data[index].stems : data[index].price}
          delete(dateBase[index]);
        } 
        
      }

      if(!fields.find( column => column === 'color')) {
        delete dato.color;
      } 

      getColumnsReport(fields);
      report.push({...dato, ...dates});

    })

    setDates(getUniqueDates(data));
    console.log('report', report);
    setDataReport(report);

  }  

  const getColumnsReport = (columnsFilter: string[] ) => {
    const showColumns = columnsFilter.map( column => columns.find( col => col.value === column));
    console.log(columnsFilter,showColumns);
    setColumnsReport(columnsFilter);
  }

  const validationsFrom = (filters: any) => {

    setValidations("");

    if(!filters.dateStart) {
      setValidations("Ingrese la fecha Inicial");
      return false;
    }

    if(!filters.dateEnd) {
      setValidations("Ingrese la fecha Final");
      return false;
    }

    if(filters.columns.length <= 0) {
      setValidations("Ingrese la o las Columnas");
      return false;
    }

    if(!filters.valor) {
      setValidations("Ingrese el Tipo");
      return false;
    }

    return true;
  }

  const getReport =  async (filters: any) => {

    let fields = [...filters.columns]

    if(validationsFrom(filters)) {

      const dateStart = filters.dateStart.toISOString().split("T")[0];
      const dateEnd = filters.dateEnd.toISOString().split("T")[0];
      
      const valor = filters.valor.toString();

      if(fields.find( (column: string) => column === 'variety' || column === 'color')) {
        if(!fields.find( (column: string) => column === 'category')) {
          fields = [...fields, 'category'];
        }
        
      }

      const columnsReportString = fields.toString();

      getDataReport(dateStart, dateEnd, columnsReportString, valor)
      .then((data) => createReport(data, fields))

    }
    
      
  }

  const totalRow = (row: any) => {

    let total = 0;

    dates.map((date: string) => {
      if(row[date]) 
        total += row[date]
    });

    return total;
  }

  const totalColumn = (date:string) => {
    let total = 0;
    dataReport.filter((data) => data[date]).map(filter => total += filter[date]);
    return total;
  }

  const totalReport = () => {
    let total = 0; 
    dates.map((date: string) => {total += totalColumn(date)});
    return total;
  }

  return (
    <main>
      <h1>Informe</h1>
      
      <Formik 
          initialValues={{
              columns: columns,
          }}
          onSubmit={ getReport }
      >

          { (errors: any) => (
          <Form>
            <div className="searcher">
              <DateSelect name="dateStart" label="Fecha Inicial: "/>
              <DateSelect name="dateEnd" label="Fecha Final: "/>
              <MultiSelect
                  label="Columnas: "
                  name="columns"
                  options={columns}
                  isMulti={true}
              />
              <MultiSelect
                  label="Tipo"
                  name="valor"
                  options={valor}
              />
              <button type="submit" className="mt-20">
                Buscar
              </button>
              <p className="error">{validations}</p>
            </div>       
            
          </Form>
          
          )}


      </Formik>
      
      {dataReport.length > 0 && 
        <section className="report">
          <div className="table-container">
          <table>
            <thead>
              <tr>
                { dataReport[0].customer && <th>Cliente</th> }
                { dataReport[0].country && <th>País</th> }
                { dataReport[0].provider && <th>Proveedor</th> }
                { dataReport[0].category && <th>Categoría</th> }
                { dataReport[0].variety && <th>Variedad</th> }
                { dataReport[0].color && <th>Color</th> }
                { dates.length > 0 && dates.map((date, i) => <th key={i}>{date}</th>)}
                <th>Total</th> 
              </tr>
            </thead>
            <tbody>
              {dataReport.map((data, i) => 
                <tr key={i}>
                  { dataReport[i].customer && <td>{data.customer}</td> }
                  { dataReport[i].country && <td>{data.country}</td> }
                  { dataReport[i].provider && <td>{data.provider}</td> }
                  { dataReport[i].category && <td>{data.category}</td> }
                  { dataReport[i].variety && <td>{data.variety}</td> }
                  { dataReport[i].color && <td>{data.color}</td> }
                  { dates.length > 0 && dates.map((date: string) => <td>{data[date]}</td>)}
                  { dates.length > 0 && <td>{totalRow(data)}</td>}
                </tr>
              )}
                <tr>
                  <td colspan={columnsReport.length}>Total</td>
                  { dates.length > 0 && dates.map((date: string) => <td>{totalColumn(date)}</td>)}
                  <td>{totalReport()}</td>
                </tr>
            </tbody>
          </table>
          </div>
        </section>
      }
    </main>
  )
}

export default App
