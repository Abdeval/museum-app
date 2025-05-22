module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './',
          },
        },
      ],
      [
        'react-native-iconify/babel',
        {
          icons: [
            'lets-icons:progress',
            'lets-icons:done-duotone',
            'solar:trash-bin-trash-bold-duotone',
            'solar:add-circle-bold-duotone',
            'solar:pen-new-round-bold-duotone',
            'solar:archive-minimalistic-bold-duotone',
            'solar:bell-off-bold-duotone',
            'solar:round-arrow-left-bold-duotone',
            'solar:round-arrow-right-bold-duotone',
            'solar:home-smile-angle-bold-duotone',
            'solar:adhesive-plaster-bold-duotone',
            'fluent:tasks-app-28-regular',
            'solar:user-rounded-bold-duotone',
            'solar:notification-unread-lines-bold-duotone',
            'solar:alarm-play-bold-duotone',
            'solar:folder-error-bold-duotone',
            'solar:close-circle-bold-duotone',
            "solar:chat-round-line-bold-duotone",
            "solar:card-search-bold-duotone",
            "solar:face-scan-square-bold-duotone",
            "logos:google-icon",
            "ic:sharp-apple",
            "solar:gallery-edit-bold-duotone",
            "mingcute:send-fill",
            "mdi:microphone",
            "mdi:microphone-outline",
            "mdi:volume-high",
            "mdi:volume-medium",
            "fluent:paint-bucket-brush-20-filled",
            "mdi:fossil-fuel-outline",
            "cib:azure-artifacts",
            "material-symbols:interactive-space-rounded",
            "pajamas:duo-chat-new",
            "lets-icons:chat-alt-add-duotone",
            "mdi:microphone",
            "mdi:chat-outline",
            "mdi:chat-outline",
            "fluent:history-20-filled",
            "fluent:people-community-20-filled",
            "mdi:robot-outline"
          ],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
