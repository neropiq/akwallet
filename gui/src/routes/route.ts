import AuthenticationComponent from "../AuthenticationComponent/AuthenticationComponent";
import Dashboard from '../components/dashboard/dashboard';
import Address from '../components/address/address';
import SendAdk from '../components/sendAdk/sendAdk';
import Transactions from '../components/transaction/transaction';
import Setting from '../components/settings/settings';

const Routes = [
	{
        component: Dashboard,
    	path: "/dashboard"
	},	
	{
    	path: "/address",
      	component: Address
	},
	{
		path : "/sendAdk",
		component : SendAdk
	},
	{

		path: '/transaction',
		component: Transactions
	},
	{
		path: '/setting',
		component:Setting
	},
	{
		component: AuthenticationComponent,
		path: '/login'
	},
    {
		path: "/",
		redirect: true,
		to: "/dashboard"
	}
];

export default Routes;
