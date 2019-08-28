import { Component } from '@angular/core';
import { SshService } from '../provider/ssh.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  
  
  constructor( private ssh:SshService) {}



  getConfig(){
    
    this.ssh.getConfig();
  
  }

  clearTab(){
    this.ssh.clear=false;
    this.ssh.configuration="";
    this.ssh.confHost = "";

  }




}

