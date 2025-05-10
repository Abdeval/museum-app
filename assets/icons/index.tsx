import { COLORS } from "@/constants/Colors";
import { Iconify } from "react-native-iconify";
import { colorScheme } from "nativewind";

export const Icons = {
  inProgress: <Iconify icon="lets-icons:progress" size={24} color={"green"} />,
  done: <Iconify icon="lets-icons:done-duotone" size={32} color={"green"} />,
  delete: (
    <Iconify
      icon="solar:trash-bin-trash-bold-duotone"
      size={24}
      color={"red"}
    />
  ),
  add: (
    <Iconify icon="solar:add-circle-bold-duotone" size={24} color={"purple"} />
  ),
  update: (
    <Iconify icon="solar:pen-new-round-bold-duotone" size={24} color={"gray"} />
  ),
  view: (
    <Iconify
      icon="solar:archive-minimalistic-bold-duotone"
      size={24}
      color={"#FF9C01"}
    />
  ),
  notification: (
    <Iconify icon="solar:bell-off-bold-duotone" size={32} color={"orange"} />
  ),
  left: (
    <Iconify
      icon="solar:round-arrow-left-bold-duotone"
      size={32}
      color={"orange"}
    />
  ),
  right: (
    <Iconify
      icon="solar:round-arrow-right-bold-duotone"
      size={32}
      color={"orange"}
    />
  ),
  home: (
    <Iconify
      icon="solar:home-smile-angle-bold-duotone"
      size={28}
      color={"white"}
    />
  ),
  projects: (
    <Iconify
      icon="solar:adhesive-plaster-bold-duotone"
      size={28}
      color={COLORS.dark.icon}
    />
  ),
  tasks: (
    <Iconify
      icon="fluent:tasks-app-28-regular"
      size={28}
      color={COLORS.dark.icon}
    />
  ),
  profile: <Iconify icon="solar:user-rounded-bold-duotone" color={"white"} size={28} />,
  projectNotify: (
    <Iconify
      icon="solar:notification-unread-lines-bold-duotone"
      color={"orange"}
      size={28}
    />
  ),
  taskNotify: (
    <Iconify icon="solar:alarm-play-bold-duotone" color={"orange"} size={28} />
  ),
  error: (
    <Iconify icon="solar:folder-error-bold-duotone" color={"red"} size={28} />
  ),
  close: (
    <Iconify icon="solar:close-circle-bold-duotone" color={"black"} size={28} />
  ),
  chat: <Iconify icon="solar:chat-round-line-bold-duotone" color={'white'} size={28}/>,
  scan: <Iconify icon="solar:face-scan-square-bold-duotone" color={"black"} size={28}/>,
  exhibit: <Iconify icon="solar:card-search-bold-duotone" color={"white"} size={28}/>,
};
