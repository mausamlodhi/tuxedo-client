import Breadcrumb from "@/components/breadcrumb"
import CheckoutComponent from "@/components/checkout";
import Footer from "@/components/footer"
import Header from "@/components/header"

const CheckoutPage:React.FC = ()=>{
    return <>
        <div>
            <Header/>
        </div>
        <Breadcrumb/>
        <CheckoutComponent/>
        <Footer/>
    </>
};
export default CheckoutPage;