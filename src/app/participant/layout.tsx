'use client'
import FooterLookBuilder from "@/components/footerLookBuild"
import Header from "@/components/header"
import HeaderLookBuilder from "@/components/headerLookBuild"

const ParticipantLayout = ({
    children
}:Readonly<{
    children:React.ReactNode
}>)=>{
    return <>
        <HeaderLookBuilder title="Participant flow"/>
        {children}
        {/* <FooterLookBuilder/> */}
    </>
}

export default ParticipantLayout;