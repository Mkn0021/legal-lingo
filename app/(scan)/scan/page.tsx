import { UploadBox } from "@/components/scanpage/upload-box";
import { TopGradient } from "@/components/homepage/gradient-background";
import { GridPattern } from "@/components/ui/file-upload";
import { Logo } from "@/components/homepage/logo";

export default function Page() {
    return (
        <PageContainer>
            <nav className="absolute top-0 left-4 z-50">
                <Logo />
            </nav>
            <UploadBox />
        </PageContainer >
    )
}

const PageContainer = ({ children }: { children?: React.ReactNode }) => (
    <div className="relative overflow-hidden max-w-screen h-screen">
        <GridPattern className="absolute inset-0 mask-radial-from-0% opacity-80" />
        <TopGradient />
        <div className="relative flex h-full items-center justify-center mx-auto max-w-2xl lg:max-w-4xl xl:max-w-7xl p-6 lg:p-8">
            {children}
        </div>
    </div>
);