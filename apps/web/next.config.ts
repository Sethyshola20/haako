import type { NextConfig } from "next";
import { withExpo } from "@expo/next-adapter";

const nextConfig: NextConfig = {
  transpilePackages: [
    'react-native',
    'expo',
  ],
};

export default withExpo(nextConfig);
