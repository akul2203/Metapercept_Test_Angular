import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LabRegistrationRequest } from 'src/app/payload/Request/LabRegistrationRequest';
import baseUrl from '../user/helper';
import { BehaviorSubject, Observable } from 'rxjs';
import { LabRegistrationResponse } from 'src/app/payload/response/Response/LabRegistrationResponse';
import { Lab } from 'src/app/entity/Lab';
import { PageAppointmentRequest } from 'src/app/payload/Request/PageAppointmentRequest';
import { PageAppointmentResponse } from 'src/app/payload/response/Response/pageAppointmentResponse';
import { ApiRoutes } from 'src/app/utils/Api-Routes';



@Injectable({
  providedIn: 'root'
})
export class LabServiceService {

   labSubject = new BehaviorSubject<LabRegistrationResponse | null>(null);
    lab: Observable<any | null> = this.labSubject.asObservable();


  constructor( private  _http:HttpClient) { }

  SaveLab(lab:LabRegistrationRequest)
  {
    const headers=new HttpHeaders({
      'enctype':'multipart/from-data'
    });
    const formData=new FormData();
    if(lab.labDocuments.length!=0)
    {
      alert("came1")
      for(const file of lab.labDocuments)
     {
      formData.append("files",file);
     }
    }
    else
    {

      alert(headers);
      console.log("asdf");

    formData.append("files",'null');
    }

    // if (lab.imageName!= null) {
    //   alert("came1")

    //   formData.append("file", lab.imageName);
    // }
    // else {
    //   formData.append("file", 'null');
    // }


    formData.append("data",new Blob([JSON.stringify(lab)],{type:'application/json'}));


    return this._http.post(`${baseUrl}/lab/save1`,formData,{headers});

  }


  getLabByUserId(userId: any): Observable<any | null> {
    const url = `${baseUrl}/lab/user/${userId}`;

    return this._http.get<any>(url)
      .pipe((response:any) => {
        // Emit the lab data to the observable
        this.labSubject.next(response);
        return response;
      });
  }


  getLabByLabId(labId:any):Observable<any | null>{
    const url=`${baseUrl}/lab/getLab/${labId}`;
    return this._http.get<any>(url)
    .pipe((response:any) => {
      // Emit the lab data to the observable
      this.labSubject.next(response);
      return response;
    });
  }

  public  IMAGE_URL= 'http://localhost:8080/api/getImageApi/';

  getAllLabTestOfLab(pageNo: number, pageSize: number, sortBy: string ,labId:number): Observable<PageAppointmentRequest> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const url = `${baseUrl}/labTest/all/${pageNo}/${pageSize}/${sortBy}/${labId}`;
    console.log('service')
    return this._http.get<PageAppointmentResponse>(url,{headers});
  }


  getAllLab(pageNo:number , pageSize:number ,sortBy :string):Observable<PageAppointmentRequest> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const url =`${baseUrl}/lab/all/${pageNo}/${pageSize}/${sortBy}`;
    return this._http.get<PageAppointmentResponse>(url,{headers});

  }



  searchLab(pageNo:number , pageSize:number , lab:Lab ,sortBy : string){
    const url=`${baseUrl}/lab/search/${pageNo}/${pageSize}/${sortBy}`;
    return this._http.post(url,lab);
  }


  //To make lab favorite
  makeLabFavorite(labId: number, patientId: number): Observable<any> {
    const url = `${baseUrl}/lab/${labId}/favorite/${patientId}`;
    return this._http.post(url, {});
  }

  //To get all the favorite Labs
  allFavoriteLab(patientId:number,pageNo:number , pageSize:number,sortBy : string){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const url =ApiRoutes.ALL_FAVORITE_LAB+`${patientId}/${pageNo}/${pageSize}/${sortBy}`;
    return this._http.get<PageAppointmentResponse>(url,{headers});
  }



  //To remove Lab from favorite
  removeFavLab(patientId:number,labId:number){
    return this._http.delete(`${baseUrl}/lab/${labId}/remove/${patientId}`);
  }


  getAllBooking(labId:number){
    return this._http.get(ApiRoutes.GET_BOOKING_OF_LAB +`${labId}`)
  }

  getPatientsOfLab(labId:number){
    return this._http.get(ApiRoutes.GET_PATIENTS_OF_LAB+`${labId}`)
  }
}
