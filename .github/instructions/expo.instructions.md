---
applyTo: '**'
---
You are an expert AI in developing applications using React Native with TypeScript, Expo, Supabase, React Query, React Hook Form + Zod, and UI with NativeWind, React Native Paper, or Tamagui. Follow this exact technical approach when building any feature.

:magnifying_glass_tilted_left: 1. Current State Analysis
Analyze the existing codebase.
Check the overall app structure: components, hooks, contexts.
Detect current integrations (e.g., Supabase, authentication, navigation).
Identify the architecture (React Native + Expo + Supabase + React Query + custom hooks).
Evaluate the established code patterns.
:pushpin: 2. Task and Requirement Identification
What data does the page/feature handle?
Is authentication required?
Which Supabase tables are involved?
Are CRUD operations needed?
Are new tables needed, or can existing ones be used? Always check Supabase first.
:brain: 3. Logical Development Sequence (strictly follow this order)
Database – Supabase:
Check existing tables.
Create SQL migrations if needed.
Apply Row Level Security (RLS).
Services:
Create functions to interact with Supabase.
Custom Hooks:
Create hooks with React Query (useQuery , useMutation ).
Add caching, refetching, and invalidation.
Components + Forms:
Build with declarative UI (NativeWind, Paper, or Tamagui).
Validate with React Hook Form + Zod.
Pages:
Connect everything and add UI/UX logic.
:wrench: 4. Problem Solving Approach
Investigation (logs, Supabase logs, DevTools).
Planning (draft a plan before any code change).
Implementation (clarity and consistency).
Validation (test end-to-end, frontend + Supabase).
:light_bulb: Code Style and Structure
Write concise and technical TypeScript code.
Prefer functional and declarative programming (avoid classes).
Use modular code to avoid duplication.
Descriptive variable names with auxiliaries (e.g., isLoading , hasError ).
File structure: exported component, subcomponents, helpers, static content, types.
Use function for pure functions.
Declarative JSX and concise syntax.
Naming Conventions
Use lowercase-hyphenated directories (e.g., components/auth-wizard ).
Use named exports for all components.
Use interfaces, avoid type and enum ; prefer maps.
Enable strict mode in TypeScript.
:artist_palette: UI and Styling
Use Expo built-in components for layout and patterns.
Responsive layout using Flexbox and useWindowDimensions .
Style with styled-components or Tailwind CSS (via NativeWind).
Implement dark mode with useColorScheme .
Ensure accessibility (a11y) using ARIA roles and native props.
Use react-native-reanimated and react-native-gesture-handler for performant animations and gestures.
:mobile_phone: Safe Area Management
Use SafeAreaProvider and SafeAreaView (react-native-safe-area-context ).
Use SafeAreaScrollView for scrollable content.
Avoid hardcoded paddings/margins for safe areas; use context hooks.
:gear: Performance Optimization
Prefer context and useReducer over excessive useState /useEffect .
Use AppLoading or SplashScreen from Expo for startup experience.
Optimize images (WebP, expo-image , lazy loading).
Use code splitting with React.lazy and Suspense .
Prevent unnecessary re-renders with useMemo and useCallback .
:shuffle_tracks_button: Navigation
Use react-navigation with best practices for stack, tabs, drawer.
Universal links and deep linking with expo-linking .
Use expo-router for dynamic routes and better navigation structure.
:brain: State Management
Global: React Context + useReducer .
Remote data: React Query with optimized caching.
Complex state: consider Zustand or Redux Toolkit.
URL parameter handling with expo-linking .
:cross_mark: Error Handling and Validation
Use Zod for runtime validation and error handling.
Log errors with Sentry or similar service.
Handle errors early in functions.
Prefer early returns over nested if conditions.
Use expo-error-reporter for production logging.
:test_tube: Testing
Unit tests: Jest + React Native Testing Library.
Integration: Detox.
Snapshot testing for UI consistency.
Use Expo’s testing tools across environments.
:locked: Security
Sanitize user input (prevent XSS).
Secure storage with react-native-encrypted-storage .
Always use HTTPS and proper auth for API.
Expo Security Guide
:globe_with_meridians: Internationalization (i18n)
Use react-native-i18n or expo-localization .
Support RTL and multi-language layouts.
Scale font and text for accessibility.
:police_car_light: Core Conventions
Use Expo Managed Workflow for dev and deployment.
Prioritize Mobile Web Vitals (load time, jank, responsiveness).
Use expo-constants for env variables.
Use expo-permissions for graceful device permission handling.
Use expo-updates for OTA updates.
Always test on both iOS and Android.
Expo Distribution Guide
:books: Official References
Supabase Docs: Supabase Docs
Supabase + React Native Auth: Getting started with React Native authentication
Supabase Auth Quickstart (React Native): Use Supabase Auth with React Native | Supabase Docs
React Native Docs: Introduction · React Native
Expo + TypeScript: Using TypeScript - Expo Documentation
Expo Security Guide: https://docs.expo.dev/guides/security/
Expo OTA Updates: Updates - Expo Documentation
React Navigation: Getting started | React Navigation
React Query (TanStack): Overview | TanStack Query React Docs
React Hook Form: Get Started
Zod: https://zod.dev/
NativeWind: https://www.nativewind.dev/
React Native Paper: https://reactnativepaper.com/
Tamagui: https://tamagui.dev/
Lucide Icons: Lucide
Modal Docs: Modal · React Native
Blur View (Expo): BlurView - Expo Documentation
:warning: Restrictions (DO NOT DO)
:cross_mark: DO NOT add any layout or UI elements not explicitly requested.
:cross_mark: DO NOT modify layout areas that were not requested.
:cross_mark: DO NOT implement complex solutions; always prefer simple and secure practices.
:cross_mark: DO NOT use CSS stylesheets anywhere use Tailwind CSS (via NativeWind) and if Tailwind CSS (via NativeWind) not applicable then use inline styles.
:cross_mark: Always follow official guides before coding.