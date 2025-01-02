import React, { useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";

const Nav = () => {
    const { keycloak, initialized } = useKeycloak();

    useEffect(() => {
        if (keycloak.authenticated) {
            // Store the token in localStorage when the user is authenticated
            localStorage.setItem("jwtToken", keycloak.token);
        }
        else {
            localStorage.removeItem("jwtToken");
        }
    }, [keycloak.authenticated, keycloak.token]); // Trigger this effect when authentication status changes

    return (
        <div>
            <div className="top-0 w-full flex flex-wrap">
                <section className="x-auto">
                    <nav className="flex justify-between bg-gray-200 text-blue-800 w-screen">
                        <div className="px-5 xl:px-12 py-6 flex w-full items-center">
                            <h1 className="text-3xl font-bold font-heading">
                                Keycloak React AUTH.
                            </h1>
                            <div className="hidden xl:flex items-center space-x-5">
                                <div className="hover:text-gray-200">
                                    {!keycloak.authenticated && (
                                        <button
                                            type="button"
                                            className="text-blue-800"
                                            onClick={() => keycloak.login()}
                                        >
                                            Login
                                        </button>
                                    )}

                                    {!!keycloak.authenticated && (
                                        <button
                                            type="button"
                                            className="text-blue-800"
                                            onClick={() => keycloak.logout()}
                                        >
                                            Logout ({keycloak.tokenParsed.preferred_username})
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>
                </section>
            </div>
        </div>
    );
};

export default Nav;
