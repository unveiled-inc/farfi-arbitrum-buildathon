import axios from 'axios';

export const decodeData = async (msg: string) => {
  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/frame/validate`,
      {
        method: 'POST',
        body: JSON.stringify({ message_bytes_in_hex: msg }),
        cache: 'no-store',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          api_key: process.env.NEYNAR_API_KEY as string,
        },
      },
    );

    const response = await res.json();

    const interactor = response.action.interactor;
    const tapped = response.action.tapped_button;
    // console.log(response);
    return { interactor, tapped };
  } catch (error: any) {
    console.error('Request failed', error.response);
  }
};
