import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/user/login.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  user: User = new User;
  role:any;
  loginstatus: boolean = false;
  constructor(private loginservice:LoginService){}


  ngOnInit(): void {

    this.loginservice.getCurrentUser().subscribe((Data:any)=>{
      this.user=Data;

      // console.log(this.user);
      if(this.user){
        this.loginstatus=true;
      }
      const userRole: UserRole | undefined = this.user.userRole[0];
      const role: { roleId: number; roleName: string } | undefined = userRole?.role;
      // Storing 'role' in another variable
      const anotherVariable: { roleId: number; roleName: string } | undefined = role;
      this.role=anotherVariable.roleName;
      //  console.log(this.role=anotherVariable.roleName);
       console.log(this.role);

    },
    (error:any)=>{
      //error
      console.log("________>>>>>>>>>>>>>>>"+error);
      })

    // throw new Error('Method not implemented.');
  }

  logout(){

  }


}

export class User {
  id: number=0;
  name: string='';
  email: string='';
  password: string='';
  status: string='';
  role: any; // You can replace 'any' with the actual type of the 'role' property
  userRole: UserRole[] = [];
}

// Define the interface for the 'UserRole' array
interface UserRole {
  role: {
    roleId: number;
    roleName: string;
  };
  userRoleId: number;
}
