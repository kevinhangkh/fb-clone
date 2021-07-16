import { Component, Input, OnInit } from '@angular/core';
import * as $ from "jquery";
import { UserData } from 'src/app/shared/userdata.model';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {

  @Input() currentUser: UserData;
  @Input() users: UserData[];

  constructor() { }
  
  ngOnInit(): void {

    // console.log('%c contact-list', 'color: lightsalmon; font-weight: bold;');
    // console.log('%c contact-list', 'color: orange; font-weight: 500;');
    // console.log('%c contact-list', 'font-weight: bold; font-size: 20px');
    

    //Because displaying elements outside of overflow: hidden is not allowed, we had to improvise, adapt, overcome...
    //JQuery code that allows to reposition the tooltip according to the hovered contact
    $(document).ready(function() {
      // Delegated listener that allows dynamically created elements to listen to mouseenter event
      // Basically says that all children of .contact-list-container must listen to the mouseenter event (even those that are not created yet)
      $('.contact-list-container').on('mouseenter', '.contact-list', function(){

        var $contactList = $(this),
            $toolTipCard = $('> .contact-card-tooltip-wrapper', $contactList);
        
        // Grabs the contact element's position relative to its positioned parent
        var contactListPos = $contactList.position();
        var padding = 10;

        // Places the tooltip card in the correct position relevant to the menu item
        $toolTipCard.css({
          top: contactListPos.top + Math.round($contactList.height() / 2) - Math.round($toolTipCard.height() / 2),
          left: contactListPos.left - Math.round($toolTipCard.width()) - padding,
        });
      });
    });

  }
}
