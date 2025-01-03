import Keycloak from "keycloak-js";

const keycloak = new Keycloak({
    url: "https://kc-service-deploy.app.cloud.cbh.kth.se/",
    realm: "master",
    clientId: "frontend-client",
});

export default keycloak;