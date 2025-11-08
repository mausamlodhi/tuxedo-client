import Breadcrumb from "@/components/breadcrumb";
import Footer from "@/components/footer"
import Header from "@/components/header"
import SuitetDetailComponent from "@/components/suiteDetails"

const SuiteDetailsPage: React.FC = () => {
    return <>
        <div className="shadow-2xl">
            <Header />
        </div>
        <Breadcrumb/>
        <SuitetDetailComponent />
        <Footer/>
    </>
};

export default SuiteDetailsPage;