import axios, { AxiosError, type AxiosRequestConfig } from "axios";

export interface ApiFailure {
  ok: false;
  status: number | null;
  error: string;
}

export interface ApiSuccess<T> {
  ok: true;
  status: number;
  data: T;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export const apiClient = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

export const toApiFailure = (error: unknown): ApiFailure => {
  if (error instanceof AxiosError) {
    return {
      ok: false,
      status: error.response?.status ?? null,
      error:
        (error.response?.data as { error?: string } | undefined)?.error ??
        error.message ??
        "Request failed",
    };
  }

  return {
    ok: false,
    status: null,
    error: "Request failed",
  };
};

export const apiRequest = async <T>(
  config: AxiosRequestConfig
): Promise<ApiResult<T>> => {
  try {
    const response = await apiClient.request<T>(config);

    return {
      ok: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    return toApiFailure(error);
  }
};
