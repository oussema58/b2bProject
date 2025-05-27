import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { EmailUserConfirmationComponent } from './email-user-confirmation/email-user-confirmation.component';
import { EmailSocietyConfirmationComponent } from './email-society-confirmation/email-society-confirmation.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { UserManagmentComponent } from './user-managment/user-managment.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClientManagmentComponent } from './client-managment/client-managment.component';
import { ClientDetailsComponent } from './client-details/client-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { CategoryManagmentComponent } from './category-managment/category-managment.component';
import { FamilyManagmentComponent } from './family-managment/family-managment.component';
import { TaxManagmentComponent } from './tax-managment/tax-managment.component';
import { ArticleManagmentComponent } from './article-managment/article-managment.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { TarifManagmentComponent } from './tarif-managment/tarif-managment.component';
import { TarifAddComponent } from './tarif-add/tarif-add.component';
import { TarifUpdateComponent } from './tarif-update/tarif-update.component';
import { authGuard } from './guards/auth.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { UnautherizedComponent } from './unautherized/unautherized.component';
import { restrictUserFromAccessingOtherClientInfoGuard } from './guards/restrict-user-from-accessing-other-client-info.guard';
import { ChartComponent } from './chart/chart.component';
import { StoreComponent } from './store/store.component';
import { StoreMainComponent } from './store-main/store-main.component';
import { StoreArticlesComponent } from './store-articles/store-articles.component';
import { OrderManagmentComponent } from './order-managment/order-managment.component';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { DemandeRetourAddComponent } from './demande-retour-add/demande-retour-add.component';
import { DemandeRetourDetailsComponent } from './demande-retour-details/demande-retour-details.component';
import { MotifManagmentComponent } from './motif-managment/motif-managment.component';
import { DemandeRetourManagmentComponent } from './demande-retour-managment/demande-retour-managment.component';
import { StoreArticleDetailsComponent } from './store-article-details/store-article-details.component';
import { StoreUserDashboardComponent } from './store-user-dashboard/store-user-dashboard.component';
import { CartModalComponent } from './cart-modal/cart-modal.component';
import { ClientContainerComponent } from './client-container/client-container.component';
import { ArticleContainerComponent } from './article-container/article-container.component';
import { TarifContainerComponent } from './tarif-container/tarif-container.component';
import { OrderContainerComponent } from './order-container/order-container.component';
import { DemandeRetourContainerComponent } from './demande-retour-container/demande-retour-container.component';

import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

import { UserDashboardMainComponent } from './user-dashboard-main/user-dashboard-main.component';
import { WishlistComponent } from './wishlist/wishlist.component';
import { UserDashboardDetailsComponent } from './user-dashboard-details/user-dashboard-details.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { UserContainerComponent } from './user-container/user-container.component';
import { UserDashboardSocieteComponent } from './user-dashboard-societe/user-dashboard-societe.component';



/*const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login',component:LoginComponent},
  {path:'welcome',component:CartModalComponent},
  {path:"store",component:StoreComponent,children:[
    {path:"",component:StoreMainComponent},
    //{path:"article/category/:categoryId/:categoryName",component:StoreArticlesComponent},
    {path:"article/category/:category1Name/:category2Name/:category3Name",component:StoreArticlesComponent},
    {path:"article/:articleId/detail",component:StoreArticleDetailsComponent,data:{role:["ADMIN","CLIENT"]}},
    {path:"user/dashboard",component:StoreUserDashboardComponent},
    {path:"panier",component:ChartComponent}
  ]},
  //{path:"store/panier",component:ChartComponent},
{path:'dashboard',component:DashboardComponent,canActivateChild:[authGuard]
,children:[
{path:'',component:MainDashboardComponent,data:{role:["ADMIN","CLIENT"]}},
{path:'client',component:ClientManagmentComponent,data:{role:["ADMIN"]}},
{path:'client/:clientId/detail',component:ClientDetailsComponent,canActivate:[restrictUserFromAccessingOtherClientInfoGuard],
data:{role:["ADMIN","CLIENT"]}},
{path:'client/:clientId/user',component:UserManagmentComponent,data:{role:["ADMIN","CLIENT"]}},
{path:'user/:userId/detail',component:UserDetailsComponent,data:{role:["ADMIN","CLIENT"]}},
{path:'category',component:CategoryManagmentComponent,data:{role:["ADMIN"]}},
{path:'family',component:FamilyManagmentComponent,data:{role:["ADMIN"]}},
{path:"tax",component:TaxManagmentComponent,data:{role:["ADMIN"]}},
{path:"article",component:ArticleManagmentComponent,data:{role:["ADMIN"]}},
{path:"article/:articleId/detail",component:ArticleDetailsComponent,data:{role:["ADMIN","CLIENT"]}},
{path:"tarif",component:TarifManagmentComponent,data:{role:["ADMIN"]}},
{path:"tarif/add",component:TarifAddComponent,data:{role:["ADMIN"]}},
{path:"tarif/:idTarif/update",component:TarifUpdateComponent,data:{role:["ADMIN"]}},
{path:"order",component:OrderManagmentComponent,data:{role:["ADMIN","CLIENT"]}},
{path:"order/:orderId/detail",component:OrderDetailsComponent,data:{role:["ADMIN","CLIENT"]}},
{path:"demandeRetour",component:DemandeRetourManagmentComponent,data:{role:["ADMIN","CLIENT"]}},
{path:"demandeRetour/add/:orderId",component:DemandeRetourAddComponent,data:{role:["CLIENT"]}},
{path:"demandeRetour/:idDemandeRetour",component:DemandeRetourDetailsComponent,data:{role:["ADMIN","CLIENT"]}},
{path:"motif",component:MotifManagmentComponent,data:{role:["ADMIN"]}}

]
}
,{path:"unauthorized",component:UnautherizedComponent}
,{path: "**", component: NotFoundComponent }

];*/
const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login',component:LoginComponent},
   {path:"client/dashboard",component:UserDashboardComponent,children:[
    {path:'',component:UserDashboardMainComponent,canActivate:[authGuard],data:{role:["CLIENT","SUPER_CLIENT"]}},
    {path:'order',component:OrderContainerComponent,children:[
      {path:"",component:OrderManagmentComponent,canActivate:[authGuard],data:{role:["CLIENT","SUPER_CLIENT"]}},
      {path:":orderId/detail",component:OrderDetailsComponent,canActivate:[authGuard],data:{role:["CLIENT","SUPER_CLIENT"]}}
    ]},
    {path:'demandeRetour',component:DemandeRetourContainerComponent,children:[
      {path:"",component:DemandeRetourManagmentComponent,canActivate:[authGuard],data:{role:["CLIENT","SUPER_CLIENT"]}},
      {path:":idDemandeRetour/detail",component:DemandeRetourDetailsComponent,canActivate:[authGuard],data:{role:["CLIENT","SUPER_CLIENT"]}},
      {path:"add/:orderId",component:DemandeRetourAddComponent,canActivate:[authGuard],data:{role:["CLIENT","SUPER_CLIENT"]}},
    ]},
    {path:':clientId/user',component:UserContainerComponent,children:[
      {path:'',component:UserManagmentComponent,canActivate:[authGuard],data:{role:["ADMIN","CLIENT","SUPER_CLIENT"]}},
      {path:':userId/detail',component:UserDetailsComponent,canActivate:[authGuard],data:{role:["ADMIN","CLIENT","SUPER_CLIENT"]}},
    ]},
    {path:'account/detail',component:UserDashboardDetailsComponent,canActivate:[authGuard],data:{role:["CLIENT","SUPER_CLIENT"]}},
    {path:'societe/detail',component:UserDashboardSocieteComponent,canActivate:[authGuard],data:{role:["CLIENT","SUPER_CLIENT"]}
  }

    
    
  ]},



  {path:"store",component:StoreComponent,canActivateChild:[authGuard],children:[
    {path:"",component:StoreMainComponent,data:{role:["CLIENT","SUPER_CLIENT"]}},
    {path:"aboutUs",component:AboutUsComponent,data:{role:["CLIENT","SUPER_CLIENT"]}},
    {path:"wishlist",component:WishlistComponent,data:{role:["CLIENT","SUPER_CLIENT"]}},
    {path:"article/category/:category1Name/:category2Name/:category3Name",component:StoreArticlesComponent,data:{role:["CLIENT","SUPER_CLIENT"]}},
    {path:"article/:articleId/detail",component:StoreArticleDetailsComponent,data:{role:["CLIENT","SUPER_CLIENT"]}},
    {path:"user/dashboard",component:StoreUserDashboardComponent,data:{role:["CLIENT","SUPER_CLIENT"]}},
    {path:"panier",component:ChartComponent,data:{role:["CLIENT","SUPER_CLIENT"]}}
  ]},
{path:'dashboard',component:DashboardComponent
,children:[
{path:'',component:MainDashboardComponent,canActivate:[authGuard],data:{role:["ADMIN","CLIENT","SUPER_CLIENT"]}},
{path:'client',component:ClientContainerComponent,children:[
  {path:'',component:ClientManagmentComponent,canActivate:[authGuard],data:{role:["ADMIN","CLIENT","SUPER_CLIENT"]}},
  {path:':clientId/detail',component:ClientDetailsComponent,canActivate:[authGuard,restrictUserFromAccessingOtherClientInfoGuard],
  data:{role:["ADMIN","CLIENT","SUPER_CLIENT"]}},
  {path:':clientId/user',component:UserContainerComponent,children:[
    {path:'',component:UserManagmentComponent,canActivate:[authGuard],data:{role:["ADMIN","CLIENT","SUPER_CLIENT"]}},
    {path:':userId/detail',component:UserDetailsComponent,canActivate:[authGuard],data:{role:["ADMIN","CLIENT","SUPER_CLIENT"]}},
  ]}
  
]},

{path:'category',component:CategoryManagmentComponent,canActivate:[authGuard],data:{role:["ADMIN"]}},
{path:'family',component:FamilyManagmentComponent,canActivate:[authGuard],data:{role:["ADMIN"]}},
{path:"tax",component:TaxManagmentComponent,canActivate:[authGuard],data:{role:["ADMIN"]}},
{path:"article",component:ArticleContainerComponent,children:[
{path:"",component:ArticleManagmentComponent,canActivate:[authGuard],data:{role:["ADMIN"]}},
{path:":articleId/detail",component:ArticleDetailsComponent,canActivate:[authGuard],data:{role:["ADMIN","CLIENT","SUPER_CLIENT"]}}
]},
{path:"tarif",component:TarifContainerComponent,children:[
  {path:"",component:TarifManagmentComponent,canActivate:[authGuard],data:{role:["ADMIN"]}},
  {path:"add",component:TarifAddComponent,canActivate:[authGuard],data:{role:["ADMIN"]}},
  {path:":idTarif/update",component:TarifUpdateComponent,canActivate:[authGuard],data:{role:["ADMIN"]}},
]},
{path:"order",component:OrderContainerComponent,children:[
  {path:"",component:OrderManagmentComponent,canActivate:[authGuard],data:{role:["ADMIN","CLIENT","SUPER_CLIENT"]}},
  {path:":orderId/detail",component:OrderDetailsComponent,canActivate:[authGuard],data:{role:["ADMIN","CLIENT","SUPER_CLIENT"]}}
]},
{path:"demandeRetour",component:DemandeRetourContainerComponent,children:[
  {path:"",component:DemandeRetourManagmentComponent,canActivate:[authGuard],data:{role:["ADMIN","CLIENT","SUPER_CLIENT"]}},
  {path:"add/:orderId",component:DemandeRetourAddComponent,canActivate:[authGuard],data:{role:["CLIENT","SUPER_CLIENT"]}},
  {path:":idDemandeRetour/detail",component:DemandeRetourDetailsComponent,canActivate:[authGuard],data:{role:["ADMIN"]}}
]},
{path:"motif",component:MotifManagmentComponent,canActivate:[authGuard],data:{role:["ADMIN"]}}

]
}
,{path:"unauthorized",component:UnautherizedComponent}
,{path: "**", component: NotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
