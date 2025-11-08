import Breadcrumb from "@/components/breadcrumb";
import Footer from "@/components/footer";
import Header from "@/components/header";
import AllRentalComponent from "@/components/rentalList"

const AllRentalPage:React.FC = () =>{
    return <>
        <div className="shadow-xl">
            <Header/>
        </div>
        {/* <br/> */}
        <Breadcrumb/>
        <AllRentalComponent/>
        <Footer/>
    </>
};

export default AllRentalPage;