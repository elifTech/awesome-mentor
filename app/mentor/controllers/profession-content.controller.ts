import {Component} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgForm, NgClass, NgIf} from '@angular/common';
import {ROUTER_DIRECTIVES, CanActivate, Router, RouteParams} from '@angular/router-deprecated';
import {Select, SELECT_DIRECTIVES} from 'ng2-select';

import {CourseraService} from '../../services/coursera.service';
import {YouTubeService} from '../../services/youtube.service';
import {AwesomeService} from '../../services/awesome.service';

import {FORM_PROVIDERS, FormBuilder, Validators} from '@angular/common';
import { Observable } from 'rxjs/Observable';
import {ProfessionService} from '../../services/profession.service';
import {AuthService} from '../../services/auth.service';
import {Level} from '../../models/level.model';

import {groupBy} from 'lodash';
import {LevelItem} from "../../models/level-item.model";

@Component({
    templateUrl: 'views/mentor/profession-content.html',
    directives: [
        FORM_DIRECTIVES,
        ROUTER_DIRECTIVES,
        Select,
        SELECT_DIRECTIVES
    ],
    providers: [
        FORM_PROVIDERS,
        ProfessionService,
        CourseraService,
        YouTubeService,
        AwesomeService
    ]
})
@CanActivate(AuthService.canComponentActivate)
export class MentorProfessionContentController {
    public level:Level;
    public queryString:string = '';

    professionForm: any;
    youTubeResults$: Observable<any>;
    courseraResults$: Observable<any>;
    awesomeResults$: Observable<any>;


    constructor(protected router:Router, private _courseraService: CourseraService,
                private _youTubeService: YouTubeService, 
                private _formBuilder: FormBuilder,
                private professionService: ProfessionService,
                private params: RouteParams,
                private _awesomeService: AwesomeService) {

        this.professionForm = this._formBuilder.group({
            'queryStringInput': ['', Validators.required]
        });

        this.youTubeResults$ = this.professionForm.controls.queryStringInput.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this._youTubeService.search(term));

        this.courseraResults$ = this.professionForm.controls.queryStringInput.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this._courseraService.search(term));

        this.awesomeResults$ = this.professionForm.controls.queryStringInput.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this._awesomeService.search(term));


        this.level = new Level({title: params.get('name')});

        this.professionService
            .getLevelItems(params.get('name'), params.get('level'))
            .then((levelItems) => {
                console.log(levelItems);
                this.level.items = levelItems.map(function(item:any){return new LevelItem(item)});
            });
    }
    
    public saveItem()
    {

    }

    public addToProfession(result:any, type:string)
    {
        
        console.log(' addToProfession',  result, type);
    }

    public removeFromProfession(result:any)
    {
        console.log(' removeFromProfession(result:any)',  result);
    }
}