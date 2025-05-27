import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { EmailUserConfirmationComponent } from './email-user-confirmation/email-user-confirmation.component';
import { EmailSocietyConfirmationComponent } from './email-society-confirmation/email-society-confirmation.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AsideDashboardComponent } from './aside-dashboard/aside-dashboard.component';
import { UserManagmentComponent } from './user-managment/user-managment.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { DashboardNavbarComponent } from './dashboard-navbar/dashboard-navbar.component';
import { AuthenticationInterceptor } from './interceptors/authentication.interceptor';
import { UpdateClientComponent } from './update-client/update-client.component';
import { DeleteClientComponent } from './delete-client/delete-client.component';
import { ClientManagmentComponent } from './client-managment/client-managment.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { UserUpdateComponent } from './user-update/user-update.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons';
import { CategoryManagmentComponent } from './category-managment/category-managment.component';
import { FamilyManagmentComponent } from './family-managment/family-managment.component';
import { ArticleManagmentComponent } from './article-managment/article-managment.component';
import { DeleteCategoryComponent } from './delete-category/delete-category.component';
import { DeleteFamilyComponent } from './delete-family/delete-family.component';
import { TaxManagmentComponent } from './tax-managment/tax-managment.component';
import { ArticleUpdateComponent } from './article-update/article-update.component';
import { TarifManagmentComponent } from './tarif-managment/tarif-managment.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { ArticleAddComponent } from './article-add/article-add.component';
import { TarifAddComponent } from './tarif-add/tarif-add.component';
import { TarifUpdateComponent } from './tarif-update/tarif-update.component';
import { StorageService } from './services/storage.service';
import { UnautherizedComponent } from './unautherized/unautherized.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { UserAddComponent } from './user-add/user-add.component';
import {MatMenuModule} from '@angular/material/menu'
import{MatButtonModule} from '@angular/material/button';
import { ChartComponent } from './chart/chart.component';
import { StoreComponent } from './store/store.component';
import { StoreNavbarComponent } from './store-navbar/store-navbar.component';
import { StoreMainComponent } from './store-main/store-main.component';
import { StoreArticlesComponent } from './store-articles/store-articles.component';
import { CartModalComponent } from './cart-modal/cart-modal.component';
import { PaymentComponent } from './payment/payment.component';
import { OrderManagmentComponent } from './order-managment/order-managment.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { DemandeRetourAddComponent } from './demande-retour-add/demande-retour-add.component';
import { DemandeRetourManagmentComponent } from './demande-retour-managment/demande-retour-managment.component';
import { DemandeRetourDetailsComponent } from './demande-retour-details/demande-retour-details.component';
import { MotifManagmentComponent } from './motif-managment/motif-managment.component';
import { FooterComponent } from './footer/footer.component';
import { FamilyAddComponent } from './family-add/family-add.component';
import { FamilyUpdateComponent } from './family-update/family-update.component'
import{MatTableModule} from '@angular/material/table'
import{MatPaginatorModule} from '@angular/material/paginator'
import {MatCardModule} from '@angular/material/card';
import { StoreArticleDetailsComponent } from './store-article-details/store-article-details.component';
import { StoreUserDashboardComponent } from './store-user-dashboard/store-user-dashboard.component';
import { MatIconModule } from '@angular/material/icon';
import { ClientContainerComponent } from './client-container/client-container.component';
import { ArticleContainerComponent } from './article-container/article-container.component';
import { OrderContainerComponent } from './order-container/order-container.component';
import { TarifContainerComponent } from './tarif-container/tarif-container.component';
import { DemandeRetourContainerComponent } from './demande-retour-container/demande-retour-container.component';
import { UserContainerComponent } from './user-container/user-container.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserDashboardMainComponent } from './user-dashboard-main/user-dashboard-main.component';


import { StoreNavbarBackupComponent } from './store-navbar-backup/store-navbar-backup.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { StoreFooterComponent } from './store-footer/store-footer.component';
import {MatSliderModule} from '@angular/material/slider';
import { UserDashboardDetailsComponent } from './user-dashboard-details/user-dashboard-details.component';
import { ConfirmAccountModificationComponent } from './confirm-account-modification/confirm-account-modification.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { UserDashboardSocieteComponent } from './user-dashboard-societe/user-dashboard-societe.component';
import { UpdateSocieteConfirmationComponent } from './update-societe-confirmation/update-societe-confirmation.component';
import { WishlistTableComponent } from './wishlist-table/wishlist-table.component';
import { CommandeLivraisonDateComponent } from './commande-livraison-date/commande-livraison-date.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    NavBarComponent,
    EmailUserConfirmationComponent,
    EmailSocietyConfirmationComponent,
    DashboardComponent,
    AsideDashboardComponent,
    UserManagmentComponent,
    MainDashboardComponent,
    DashboardNavbarComponent,
    UpdateClientComponent,
    DeleteClientComponent,
    ClientManagmentComponent,
    ClientDetailsComponent,
    UserUpdateComponent,
    UserDetailsComponent,
    CategoryManagmentComponent,
    FamilyManagmentComponent,
    ArticleManagmentComponent,
    DeleteCategoryComponent,
    DeleteFamilyComponent,
    TaxManagmentComponent,
    ArticleUpdateComponent,
    TarifManagmentComponent,
    ArticleDetailsComponent,
    ArticleAddComponent,
    TarifAddComponent,
    TarifUpdateComponent,
    UnautherizedComponent,
    NotFoundComponent,
    UserAddComponent,
    ChartComponent,
    StoreComponent,
    StoreNavbarComponent,
    StoreMainComponent,
    StoreArticlesComponent,
    CartModalComponent,
    PaymentComponent,
    OrderManagmentComponent,
    OrderDetailsComponent,
    DemandeRetourAddComponent,
    DemandeRetourManagmentComponent,
    DemandeRetourDetailsComponent,
    MotifManagmentComponent,
    FooterComponent,
    FamilyAddComponent,
    FamilyUpdateComponent,
    StoreArticleDetailsComponent,
    StoreUserDashboardComponent,
    ClientContainerComponent,
    ArticleContainerComponent,
    OrderContainerComponent,
    TarifContainerComponent,
    DemandeRetourContainerComponent,
    UserDashboardComponent,
    UserDashboardMainComponent,
    StoreNavbarBackupComponent,
    WishlistComponent,
    StoreFooterComponent,
    UserDashboardDetailsComponent,
    ConfirmAccountModificationComponent,
    AboutUsComponent,
    UserContainerComponent,
    UserDashboardSocieteComponent,
    UpdateSocieteConfirmationComponent,
    WishlistTableComponent,
    CommandeLivraisonDateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,HttpClientModule,ReactiveFormsModule,FormsModule,MatDialogModule, BrowserAnimationsModule,ToastrModule.forRoot(),NgxBootstrapIconsModule,
    MatMenuModule,MatButtonModule,MatPaginatorModule,MatTableModule,MatCardModule,MatIconModule,MatSliderModule,BrowserAnimationsModule
  ],
  providers: [{provide:HTTP_INTERCEPTORS,useClass:AuthenticationInterceptor,multi:true},StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
