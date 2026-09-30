import Script from "next/script";

export default function PatientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
            <Script
                id="three-importmap"
                type="importmap"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        imports: {
                            three: "https://unpkg.com/three@0.160.0/build/three.module.js",
                            "three/addons/": "https://unpkg.com/three@0.160.0/examples/jsm/",
                        },
                    }),
                }}
            />
            <Script
                id="viora-options"
                dangerouslySetInnerHTML={{
                    __html: `window.VIORA_OPTIONS = { tag: 'Rehab Buddy', side: 'right' };`,
                }}
            />
            <Script type="module" src="/viora-widget/viora.js" />
        </>
    );
}
