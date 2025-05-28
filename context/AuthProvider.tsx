import { useStorageState } from "@/hooks/useStorageState";
import { auth } from "@/lib/api/axios-instance";
import { UserCredentials, UserToken } from "@/types";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import { createContext, type PropsWithChildren, use, useState } from "react";

const AuthContext = createContext<{
  signIn: (user: Omit<UserCredentials, "confirmPassword">) => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  user: UserToken | null;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  user: null,
});

export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const router = useRouter();

  const [user, setUser] = useState<UserToken | null>(() => {
    const userToken = SecureStore.getItem("session");
    if (userToken) {
      const user = jwtDecode(userToken) as UserToken;
      return user;
    }
    return null;
  });


  const signIn = async (user: Omit<UserCredentials, "confirmPassword">): Promise<any> => {
    try {
      const res = await auth.post("/signin", user);

      // Vérifiez si la réponse contient bien les données attendues
      if (!res.data || !res.data.access_token) {
        console.error("Sign-in error: No access_token in response", res.data);
        throw new Error("Réponse de connexion invalide du serveur.");
      }

      const accessToken: string = res.data.access_token;
      console.log("Access Token:", accessToken);

      // Stocker la session (par exemple, le token brut)
      setSession(accessToken); // Assurez-vous que setSession est défini

      // Décoder le token pour obtenir les informations utilisateur
      // Il est bon d'encapsuler cela aussi dans un try-catch si le token peut être malformé
      let userInfo: UserToken;
      try {
        userInfo = jwtDecode<UserToken>(accessToken); // Spécifier le type attendu
      } catch (decodeError) {
        console.error("Error decoding JWT:", decodeError);
        // Nettoyer la session si le token est invalide
        setSession(null);
        setUser(null);
        throw new Error(
          "Session invalide. Veuillez réessayer de vous connecter."
        );
      }

      setUser(userInfo); // Assurez-vous que setUser est défini
      return userInfo;
      // Optionnel : retourner les informations utilisateur ou un statut de succès
      // return { success: true, user: userInfo };
    } catch (error: any) {
      // Le type 'any' est utilisé ici pour la flexibilité, mais on va l'inspecter
      let userFriendlyMessage =
        "Une erreur s'est produite lors de la connexion.";
      let loggedError = error; // Erreur à journaliser pour les développeurs

      if (error.response) {
        // La requête a été faite et le serveur a répondu avec un statut d'erreur (hors de la plage 2xx)
        console.error("Server Error Status:", error.response.status);
        console.error("Server Error Data:", error.response.data);
        loggedError = {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        };

        // Essayer d'obtenir un message plus spécifique du serveur
        if (
          error.response.data &&
          typeof error.response.data.message === "string"
        ) {
          userFriendlyMessage = error.response.data.message;
        } else if (
          error.response.data &&
          typeof error.response.data.error === "string"
        ) {
          userFriendlyMessage = error.response.data.error;
        } else if (error.response.status === 401) {
          userFriendlyMessage = "Email ou mot de passe incorrect.";
        } else if (error.response.status === 400) {
          userFriendlyMessage =
            "Requête invalide. Veuillez vérifier les informations saisies.";
        } else if (error.response.status >= 500) {
          userFriendlyMessage =
            "Erreur du serveur. Veuillez réessayer plus tard.";
        }
      } else if (error.request) {
        // La requête a été faite mais aucune réponse n'a été reçue
        console.error("Network Error: No response received", error.request);
        userFriendlyMessage =
          "Erreur de réseau. Vérifiez votre connexion internet et réessayez.";
        loggedError = error.request;
      } else if (
        (error.message &&
          error.message.startsWith("Réponse de connexion invalide")) ||
        error.message.startsWith("Session invalide")
      ) {
        // Erreurs personnalisées déjà levées dans le bloc try
        userFriendlyMessage = error.message;
      } else {
        // Quelque chose s'est passé lors de la configuration de la requête ou une autre erreur JS
        console.error("Error:", error.message);
        userFriendlyMessage =
          error.message || "Une erreur inconnue s'est produite.";
      }

      // Journaliser l'erreur détaillée pour les développeurs
      // Vous pourriez utiliser un service de logging plus avancé ici en production
      console.error(
        "Full sign-in error details for developers:",
        loggedError,
        "Original error object:",
        error
      );

      // Propager l'erreur pour que l'interface utilisateur puisse la gérer
      // Lancer une nouvelle erreur avec le message convivial est une bonne pratique
      throw new Error(userFriendlyMessage);
    }
  };

  const signOut = () => {
    setSession(null);
    router.replace("/sign-in");
  };
  return (
    <AuthContext
      value={{
        signIn,
        signOut,
        session,
        isLoading,
        user,
      }}
    >
      {children}
    </AuthContext>
  );
}
