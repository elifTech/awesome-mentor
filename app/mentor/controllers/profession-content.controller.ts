import {Component} from '@angular/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgForm, NgClass, NgIf} from '@angular/common';
import {ROUTER_DIRECTIVES, CanActivate, Router, RouteParams} from '@angular/router-deprecated';
import {Select, SELECT_DIRECTIVES} from 'ng2-select';
import {MODAL_DIRECTIVES} from 'ng2-bs3-modal/ng2-bs3-modal';


import {CourseraService} from '../../services/coursera.service';
import {YouTubeService} from '../../services/youtube.service';
import {AwesomeService} from '../../services/awesome.service';

import {FORM_PROVIDERS, FormBuilder, Validators} from '@angular/common';
import { Observable } from 'rxjs/Observable';
import {ProfessionService} from '../../services/profession.service';
import {AuthService} from '../../services/auth.service';
import {Level} from '../../models/level.model';
import {Profession} from '../../models/profession.model';

import {groupBy} from 'lodash';
import {LevelItem} from "../../models/level-item.model";

@Component({
    templateUrl: 'views/mentor/profession-content.html',
    directives: [
        MODAL_DIRECTIVES,
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
    public currItemIndex:number;
    public professionName:string = '';
    public profession:Profession;
    public queryString:string = '';

    professionForm: any;
    youTubeResults: any[];
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

        this.professionForm.controls.queryStringInput.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .subscribe(term => {
                this.searchYoutube();
            });

        this.courseraResults$ = this.professionForm.controls.queryStringInput.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this._courseraService.search(term));

        this.awesomeResults$ = this.professionForm.controls.queryStringInput.valueChanges
            .debounceTime(400)
            .distinctUntilChanged()
            .switchMap(term => this._awesomeService.search(term));


        this.professionName = decodeURIComponent(params.get('name'));
        this.level = new Level({
            name: decodeURIComponent(params.get('level'))
        });

        this.professionService
            .getLevelItems(this.professionName, this.level.name)
            .then((levelItems) => {
                console.log(levelItems);
                this.level.items = levelItems.map(function(item:any){return new LevelItem(item)});
            });

        this.professionService
            .getByName(this.professionName)
            .then((profession) => {
                this.profession = profession;
                console.log('this.profession', this.profession);
            });
    }
    
    protected searchYoutube()
    {
        if(this.queryString.length > 0) {
            console.log('this.queryString', this.queryString);
            this._youTubeService.search(this.queryString).then(res => {
                console.log('youTubeResults', res.json().items);
                this.youTubeResults = res.json().items;
            });
        }
    }
    
    public saveItem()
    {
        this.professionService.saveLevel(this.professionName, this.level);
    }

    public onSelectTag($event:any)
    {
        this.level.items[this.currItemIndex].tags = [];
        $event.forEach(tagObj => {
            if(tagObj.id.length > 0) {
                this.level.items[this.currItemIndex].tags.push(tagObj.id);
            }
        });
    }

    public addToLevel(item:any, type:string)
    {
        var levelItem = new LevelItem();
        levelItem.parseFrom(item, type);
        this.level.items.push(levelItem);
        console.log(' addToProfession',  item, type);
        this.currItemIndex = this.level.items.length - 1;
    }

    public removeFromLevel(index:number)
    {
        console.log(' removeFromProfession(result:any)',  index);
        this.level.items.splice(index, 1);
    }
}