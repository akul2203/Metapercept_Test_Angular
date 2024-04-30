import { ScheduleRequest } from 'src/app/payload/Request/ScheduleRequest';
import { DoctorScheduleService } from 'src/app/services/doctor-schedule.service';
import { Component, OnInit } from '@angular/core';
import { data, error } from 'jquery';
import Swal from 'sweetalert2';
import { Doctor } from 'src/app/entity/Doctor';
import { scheduled } from 'rxjs';

@Component({
  selector: 'app-my-schedules',
  templateUrl: './my-schedules.component.html',
  styleUrls: ['./my-schedules.component.css']
})
export class MySchedulesComponent implements OnInit {


  ScheduleRequest: ScheduleRequest[] | undefined;
  drid: any;
  doctor: Doctor = new Doctor();

  constructor(private scheduleservice: DoctorScheduleService) { }

  ngOnInit(): void {
    var userString = localStorage.getItem('user');

    if (userString) {
      var user = JSON.parse(userString);
      console.log(user.email + user.id);

      if (user.id) {
        this.scheduleservice.getdoctorbyuserid(user.id).subscribe((data: any) => {
          this.doctor = data.doctor;
          this.drid = data.doctor.id;
          console.log(data);

          // Call the second API only after the first API call is completed
          this.loadSchedules();
        });
      }
    }
  }

  toggleIsActive(sc:ScheduleRequest){
    // alert(sc.isActive);
    this.scheduleservice.changeactivestatus(sc.id,sc.isActive).subscribe((data:any)=>{
      console.log("Success");

      console.log(data);

    },(error:any)=>{
      console.log("error");
      console.log(error);


    })

  }

  loadSchedules() {
    this.scheduleservice.getschedulesbydoctorid(this.drid).subscribe(
      (data: any) => {
        console.log(data);
        this.ScheduleRequest = data;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  getDayOfWeek(dateString: string): string {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    const dayOfWeekIndex = date.getDay();
    return daysOfWeek[dayOfWeekIndex];
  }



  formatTime(time: string): string {
    const [hours, minutes] = time.split(':');
    let period = 'AM';

    let formattedHours = parseInt(hours, 10);

    if (formattedHours >= 12) {
      period = 'PM';
      formattedHours = formattedHours === 12 ? 12 : formattedHours - 12;
    }

    return `${formattedHours}:${minutes} ${period}`;
  }

  deleteSchedule(scheduleId: number): void {

    this.scheduleservice.deleteschedulebyid(scheduleId).subscribe((data) => {
      console.log(data);
    }, (error: any) => {
      console.log(error);
    });
    window.location.reload();
    Swal.fire(({
      title: "Deleted",
      text: "Time slotes has been successfully Deleted",
      icon: "success"
    }));
    console.log(`Deleting schedule with ID: ${scheduleId}`);
  }


  deleteScheduleConfirmation(scheduleId: number): void {
    Swal.fire({
      title: 'Confirmation',
      text: 'Are you sure you want to delete this schedule?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // User clicked 'Yes'
        this.deleteSchedule(scheduleId);
      }
    });
  }
}
