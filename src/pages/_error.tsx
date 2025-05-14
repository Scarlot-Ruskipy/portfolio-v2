import React from 'react';
import { NextPageContext } from 'next';
import Image from 'next/image';

interface ErrorProps {
    statusCode?: number;
}

const ErrorPage = ({ statusCode }: ErrorProps) => {
    const is404 = statusCode === 404;

    React.useEffect(() => {
        if (typeof window !== 'undefined') {

            document.body.style.overflow = "hidden";

            return () => {
                document.body.style.overflow = "auto";
            }
        }
    }, []);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            textAlign: 'center',
            flexDirection: 'column',
        }}>
            {is404 ? (
                <>
                    <Image src={"https://media1.tenor.com/m/boye5iYFWW0AAAAd/txacky.gif"} alt={"404 not found"} width={1080} height={1920} className="rounded-xl" draggable={"false"} />
                    <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50" />
                    <div className='absolute'>
                        <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
                        <p className="text-lg mt-2">Sorry, the page you are looking for does not exist.</p>
                    </div>
                </>
            ) : (
                <>
                    <h1>Something went wrong</h1>
                    <p>
                        {statusCode
                            ? `An error ${statusCode} occurred on the server.`
                            : 'An error occurred on the client.'}
                    </p>
                </>
            )}
        </div>
    );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
    const statusCode = res?.statusCode || err?.statusCode || 500;
    return { statusCode };
};

export default ErrorPage;