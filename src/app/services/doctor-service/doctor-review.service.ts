import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRoutes } from 'src/app/utils/Api-Routes';

@Injectable({
  providedIn: 'root'
})
export class DoctorReviewService {

  constructor(private _http: HttpClient) { }

  getReviewByDoctorId(doctorId: any) {
    console.log(doctorId + "he")
    const url = ApiRoutes.GET_DOCTORREVIEW_BY_Lab_ID + `${doctorId}`;
    console.log(url);

    return this._http.get(url);
  }


  addReview(review: any) {
    console.log("test");

    console.log(review);

    return this._http.post(ApiRoutes.ADD_DOCTOR_REVIEW, review);
  }


  addReply(reply: any) {
    return this._http.post(ApiRoutes.ADD_DOCTOR_REPLY, reply);
  }


  deleteReviewOfPatient(reviewId: any) {
    return this._http.delete(ApiRoutes.DELETE_REVIEW_OF_DOCTOR + `${reviewId}`);
  }


  deleteReplyOfPatient(replyId: number, reviewId: number) {
    return this._http.delete(ApiRoutes.DELETE_REPLAY_OF_REVIEW_DOCTOR + `${reviewId}` + '/' + `${replyId}`);
  }
}
