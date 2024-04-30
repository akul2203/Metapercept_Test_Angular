import { Lab } from "src/app/entity/Lab";
import { LabTest } from "src/app/entity/LabTest";
import { Patient } from "src/app/entity/Patient";

export class LabAppointment_Request {
    id:any;
    appointmentDate!: any;
    purpose!: string;
    patient: Patient = new Patient;
    labTest: LabTest = new LabTest;
    patientLabAppointmentFile: any;
    lab :Lab=new Lab;
    amount:any;
    labId:number=0;
    labName!:string;
  }
