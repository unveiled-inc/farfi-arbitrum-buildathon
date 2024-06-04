export const decodeBase64 = (base64Data: string | null): any => {
  const decodedJsonString =
    base64Data === null || base64Data === 'null' || base64Data === ''
      ? '{}'
      : Buffer.from(base64Data, 'base64').toString();
  //   console.log(decodedJsonString);
  const frameData = JSON.parse(decodedJsonString);
  return frameData;
};

export const encodeToBase64 = (data: any): string => {
  const jsonString = JSON.stringify(data);
  return Buffer.from(jsonString).toString('base64');
};
