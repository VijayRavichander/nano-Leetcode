const isAvailableMetric = (value: number | null | undefined): value is number =>
  value != null && Number.isFinite(value) && value >= 0;

const trimTrailingZeros = (value: string) => value.replace(/\.?0+$/, "");

const formatMeasuredNumber = (value: number) => {
  if (value >= 100) {
    return Math.round(value).toString();
  }

  if (value >= 10) {
    return trimTrailingZeros(value.toFixed(1));
  }

  return trimTrailingZeros(value.toFixed(2));
};

export const formatRuntime = (
  value: number | null | undefined,
  unavailable = "Runtime unavailable"
) => {
  if (!isAvailableMetric(value)) {
    return unavailable;
  }

  return `${formatMeasuredNumber(value * 1000)} ms`;
};

export const formatMemory = (
  value: number | null | undefined,
  unavailable = "Memory unavailable"
) => {
  if (!isAvailableMetric(value)) {
    return unavailable;
  }

  return `${Math.round(value).toLocaleString()} KB`;
};
