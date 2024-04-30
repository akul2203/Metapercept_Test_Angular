
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DoctorInvoice } from './../../../payload/Request/DoctorInvoice';
import { Component, OnInit } from '@angular/core';
import { InvoiceService } from 'src/app/services/Invoice-Services/invoice.service';
import { LabServiceService } from 'src/app/services/Lab-service/lab-service.service';
import { DoctorScheduleService } from 'src/app/services/doctor-schedule.service';


import { DoctorInvoice_Response } from 'src/app/payload/response/Response/doctorInvoice_Response';



@Component({
  selector: 'app-doctor-invoices',
  templateUrl: './doctor-invoices.component.html',
  styleUrls: ['./doctor-invoices.component.css']
})
export class DoctorInvoicesComponent implements OnInit {


  drid: any;
  doctorinvoice: DoctorInvoice[] = [];
  IMG_URLs = this.labService.IMAGE_URL;
  doctorInvoiceResponse: DoctorInvoice_Response []=[];
  constructor(private labService: LabServiceService, private invoiceservice: InvoiceService, private scheduleservice: DoctorScheduleService) { }





  ngOnInit(): void {
    var userString = localStorage.getItem('user');
    if (userString) {
      var user = JSON.parse(userString);
      console.log(user.email + user.id);
      if (user.id) {
        this.scheduleservice.getdoctorbyuserid(user.id).subscribe((data: any) => {
          this.drid = data.doctor.id;
          this.getinvoicefordoctor(this.drid);
        });
      }
    }
  }









  generatePDF(invoice: DoctorInvoice_Response,action:string): void {
    console.log(pdfMake);
    const documentDefinition = this.getDocumentDefinition(invoice);
    switch (action) {
      case 'open': pdfMake.createPdf(documentDefinition).open(); break;
      case 'print': pdfMake.createPdf(documentDefinition).print(); break;
      case 'download': pdfMake.createPdf(documentDefinition).download(); break;

      default: pdfMake.createPdf(documentDefinition).open(); break;
    }

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(documentDefinition).download(invoice.patientName.ps);
  }

  getinvoicefordoctor(drid: any): void {
    this.invoiceservice.getInvoicebyDOctorId(drid).subscribe((data: any) => {
      console.log(data);
      this.doctorInvoiceResponse = data.content;
      console.log('doctorInvoices------>>>>>>...');
      console.log(this.doctorinvoice);
    });
  }

  getDocumentDefinition(invoice: DoctorInvoice_Response): any {
    return {
      content: [
        {
          text: 'Doctor Invoice',
          style: 'header'
        },
        // Add content for each invoice, e.g., invoice details, patient info, etc.
        {
          text: `Invoice ID: ${invoice.id}`,
          margin: [0, 10]
        },
        {
          text: `Doctor ID: ${invoice.id}`,
          margin: [0, 10]
        },
        {
          text: `Invoice Date: ${invoice.invoiceGenerateDate}`,
          margin: [0, 10]
        },
        ,
        {
          text: `payment method: ${invoice.paymentMethod}`,
          margin: [0, 10]
        },
        // Add other invoice details here...

        // adding patient information
        {
          text: 'Patient Information',
          style: 'subheader'
        },
        {
          text: `Patient Name: ${invoice.patientName}`,
          margin: [0, 5]
        },
        ,


        //  adding appointment information
        {
          text: 'Appointment Information',
          style: 'subheader'
        },
        {
          text:  `Appointment Date: ${invoice.invoiceGenerateDate}`,
          margin: [0, 5]
        },
        ,
        {
          text:  `Appointment Fees: Rs. ${invoice.amount}`,
          margin: [0, 5]
        },
        ,


      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        }
        // Add other styles as needed...
      }
    };
  }
}


