import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountsService} from "../services/accounts.service";
import {catchError, Observable, throwError} from "rxjs";
import {AccountDetails} from "../model/account.model";
import {throws} from "node:assert";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit{

  accountFormGroup! : FormGroup;
  currentPage : number = 0;
  pageSize : number =5;
  accountObservable! : Observable<AccountDetails>
  operationFormGroup! : FormGroup;
  errorMessage! : string;
  constructor(private fb : FormBuilder, private accountService:AccountsService) {
  }
  ngOnInit() {
    this.accountFormGroup=this.fb.group({
      accountId : this.fb.control('')
    });
    this.operationFormGroup=this.fb.group({

      operationType : this.fb.control(null),
      amount : this.fb.control(0),
      description : this.fb.control(null),
      accountDestination : this.fb.control(null)
    })
  }

  handleSearchAccount() {

    let accountId : string=this.accountFormGroup.value.accountId;
    this.accountObservable=this.accountService.getAccount(accountId,this.currentPage,this.pageSize).pipe(
      catchError(err=> {
        this.errorMessage=err.error.message;
        return throwError(err);
      })
    );

  }

  gotoPage(page: number) {
    this.currentPage=page;
    this.handleSearchAccount();
  }

  handleAccountOperation() {

    let accountId : string = this.accountFormGroup.value.accountId;
    let operationType=this.operationFormGroup.value.operationType;
    let amount : number =this.operationFormGroup.value.amount;
    let description : string =this.operationFormGroup.value.description;
    let accountDestination : string =this.operationFormGroup.value.accountDestination;
    if(operationType == 'DEBIT')
    {

      this.accountService.debit(accountId,amount,description).subscribe({
        next : (data )=>{
          alert("Succes Debit");
          this.handleSearchAccount();
        },
        error:(err)=> {
          console.log(err);
        }
      });
    }else if (operationType == 'CREDIT')
    {
      this.accountService.credit(accountId,amount,description).subscribe({
        next : (data )=>{
          alert("Succes Credit");
          this.handleSearchAccount();
        },
        error:(err)=> {
          console.log(err);
        }
      });

    }else if (operationType == 'TRANSFER'){

      this.accountService.transfer(accountId,accountDestination,amount,description).subscribe({
        next : (data )=>{
          alert("Succes Transfer");
          this.handleSearchAccount();
        },
        error:(err)=> {
          console.log(err);
        }
      });
    }

  }
}
