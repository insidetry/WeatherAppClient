import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';  
import { GoogleChartComponent } from 'angular-google-charts';  
import { ChartType, Row } from "angular-google-charts";
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
imports: [
  GoogleChartComponent,
  ChartType
]

declare let google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{

  public chartData: any;
  public dataTable: any;

  title = 'Browser market shares at a specific website, 2014';
   constructor(private http: HttpClient, private datepipe: DatePipe) { 
   }

   ngOnInit() {
    google.charts.load('current', { 
      'packages': ['bar', 'corechart', 'table']
     });

     google.load('visualization', '1.0', {'packages':['corechart']});

    this.http.get('http://weatherapi-server3-dev.ap-south-1.elasticbeanstalk.com/weatherforecast')
        .subscribe((response: any) => {
            this.chartData = response;
           // console.log(response);
           
            console.log("Umesh");
           
            google.charts.setOnLoadCallback(this.drawChart.bind(this, this.chartData));
        });
  }



  private CreateTable(response: any): google.visualization.DataTable
  {
    this.dataTable = new google.visualization.DataTable();
    this.dataTable.addColumn('date', 'DateTime');
    this.dataTable.addColumn('number', 'Temperature');

    response.forEach( (element: DateTemp) => {
                var dateStr = this.datepipe.transform(element.date, 'MM/dd/YYYY HH:mm')
             
                if( dateStr != undefined)
                {
                  var dateA = new Date(dateStr);
                  this.dataTable.addRow([dateA, element.temp]);
                }
      
              });
    console.log(this.dataTable);
    return this.dataTable;
  }

  private drawChart(this: any, response: any) {
    this.dataTable = this.CreateTable(response);

    console.log("Coming")
    // Set chart options
    var options = {
      title: 'Google Line Chart Example',
      width: 1000,
      height: 600,
      hAxis: { gridlines: { count: 40 } }
  };

  var el = document.getElementById('chartDiv');
  console.log("here till")
  console.log(el)
  if( el != undefined)
  {
    console.log("here now")
    var chart = new google.visualization.ColumnChart(document.getElementById('chartDiv'));
    console.log(this.dataTable);
    var formatter = new google.visualization.DateFormat({pattern: 'MMM dd, YYYY HH:mm'});
    formatter.format(this.dataTable, 0);
    chart.draw(this.dataTable, options);
  }
}

}

class DateTemp
{
  date: Date = new Date(Date.now());
  temp: Number = 0;
}
