import axios, { AxiosRequestConfig, CancelTokenSource, Method } from "axios";
import momentTimezone from "moment-timezone";
import logger from "../utils/logger";
import modalNotification from "@/utils/notification";
import { ADMIN_ROLE, API_BASE_URL, TOKEN_KEY } from "@/utils/env";
import {
  getLocalStorageToken,
  removeLocalStorageToken,
  removeSessionStorageToken,
  setLocalStorageToken,
  getRefreshToken
} from "@/utils";
import { AdminAuthServices } from "./admin/auth/auth.service";
import { deleteCookie } from "cookies-next";
import { logoutAction } from "@/app/redux/slice/auth.slice";
import { useDispatch } from "react-redux";

interface APIRequestParams {
  method?: Method;
  url?: string;
  baseURL?: string;
  queryParams?: Record<string, any>;
  bodyData?: Record<string, any> | FormData;
  cancelFunction?: (cancel: CancelTokenSource) => void;
  formHeaders?: Record<string, string>;
  removeHeaders?: boolean;
}

const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const res = await axios.post(`${API_BASE_URL}/auth/refresh`, {
      refreshToken,
    });

    if (res.data?.accessToken) {
      setLocalStorageToken(res.data.accessToken);
      return res.data.accessToken;
    }
    return null;
  } catch (err) {
    logger("Refresh token failed", err);
    return null;
  }
};

const APIrequest = async ({
  method = "GET",
  url,
  baseURL,
  queryParams,
  bodyData,
  formHeaders,
  removeHeaders,
}: APIRequestParams): Promise<any> => {
  // const dispatch = useDispatch();
  let apiToken = getLocalStorageToken();
  try {
    const axiosConfig: AxiosRequestConfig = {
      method,
      baseURL: baseURL || API_BASE_URL,
      headers: {
        "X-Frame-Options": "sameorigin",
        timezone: momentTimezone.tz.guess(true),
      },
    };

    axiosConfig.headers = axiosConfig.headers || {};
    if (bodyData instanceof FormData) {
      axiosConfig.headers["Content-Type"] = "multipart/form-data";
    } else {
      axiosConfig.headers["Content-Type"] = "application/json";
    }

    if (formHeaders) {
      axiosConfig.headers = { ...axiosConfig.headers, ...formHeaders };
    }

    if (url) axiosConfig.url = url;

    if (queryParams) {
      const queryParamsPayload: Record<string, any> = {};
      for (const key in queryParams) {
        if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
          const element =
            typeof queryParams[key] === "string"
              ? queryParams[key].trim()
              : queryParams[key];
          if (![undefined, null, "", NaN].includes(element)) {
            queryParamsPayload[key] = element;
          }
        }
      }
      axiosConfig.params = queryParamsPayload;
    }

    if (bodyData) {
      if (bodyData instanceof FormData) {
        axiosConfig.data = bodyData;
      } else {
        const bodyPayload: Record<string, any> = {};
        for (const key in bodyData) {
          if (Object.prototype.hasOwnProperty.call(bodyData, key)) {
            const element =
              typeof bodyData[key] === "string"
                ? bodyData[key].trim()
                : bodyData[key];
            if (![undefined, NaN].includes(element)) {
              bodyPayload[key] = element;
            }
          }
        }
        axiosConfig.data = bodyPayload;
      }
    }

    if (removeHeaders) {
      delete axiosConfig.headers;
    }

    if (apiToken) {
      axiosConfig.headers = {
        ...axiosConfig.headers,
        authorization: `Bearer ${apiToken}`,
      };
    }

    const res = await axios(axiosConfig);
    return res.data;
  } catch (error: any) {
    if (axios.isCancel(error)) {
      logger("API canceled", error);
    }

    const errorRes = error?.response;
    logger("Error in the api request", errorRes);

    // --- Token Expiry Handling ---
    if (errorRes?.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        // retry the original request with new token
        const retryConfig = error.config;
        retryConfig.headers["authorization"] = `Bearer ${newToken}`;
        const retryRes = await axios(retryConfig);
        return retryRes.data;
      } else {
        modalNotification({
          type: "error",
          message: "Session expired. Please log in again.",
        });
        removeLocalStorageToken();
        removeSessionStorageToken();
        AdminAuthServices.adminLogout();
        deleteCookie(TOKEN_KEY);
        deleteCookie(ADMIN_ROLE)
        // dispatch(logoutAction())
        removeLocalStorageToken();
        const path = window.location.pathname.includes("vipadmin") ? "/vipadmin" : "/";
        window.location.replace(path);
        return null;
      }
    }

    if (errorRes?.status === 403) {
      // store.dispatch(loadPermission({}, true)); // optional logic
    }

    if (errorRes?.status === 500) {
      modalNotification({
        type: "error",
        message: errorRes.data.message || errorRes.data.error?.description,
      });
      return errorRes.data;
    }

    if ((errorRes?.status === 400 || errorRes?.status === 404) && errorRes.data.message) {
      modalNotification({
        type: "warning",
        message: errorRes.data.message,
      });
      return errorRes.data;
    }

    if (errorRes?.status === 429) {
      modalNotification({
        type: "error",
        message: errorRes.data.message || errorRes.data.error?.description,
      });
    }

    if (errorRes?.data?.error?.length > 0) {
      modalNotification({
        type: "error",
        message: errorRes.data.error[0]?.message,
      });
    }

    return null;
  }
};

export default APIrequest;
