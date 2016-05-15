import {Component} from '@angular/core';
import {RouterOutlet, RouteConfig, ROUTER_DIRECTIVES, Router} from '@angular/router-deprecated';
import {APP_ROUTES} from './app.routes';
import {LoggerService} from './services/logger.service';
import {UserModel, AuthService} from './services/auth.service';
import {Auth} from 'ng2-ui-auth';
import {GithubService} from "./services/github.service";
import {ToastrService} from "./services/toastr.service";

@Component({
    selector: 'as-main-app',
    templateUrl: '/views/app.html',
    directives: [
        RouterOutlet,
        ROUTER_DIRECTIVES
    ]
})
@RouteConfig(APP_ROUTES)
export class AppComponent {
    private user: UserModel;

    private auth: Auth;

    constructor(private authService:AuthService, public router: Router, private toastr: ToastrService) {
        authService.init();

        this.toastr.success('123123123123');

        this.auth = AuthService.auth;
        AuthService.user$.subscribe(user => {
            this.user = user;
        });
    }

    logout() {
        this.authService.logout().subscribe(() => {
            this.goToMain();
        });
    }

    goToMain() {
        this.router.navigate(['MentorLogin']);
    }
}
