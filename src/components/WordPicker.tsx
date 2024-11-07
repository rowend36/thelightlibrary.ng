import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { Add, CloseCircle } from "iconsax-react";
import { ButtonBase } from "./base/ButtonBase";
import InputBase from "./base/InputBase";

export default function WordPicker({
  options,
  value,
  onChange,
  label,
}: {
  label: string;
  options: string[];
  value: string[] | undefined;
  onChange: (e: string[]) => void;
}) {
  return (
    <Combobox
      value={value ?? []}
      onChange={(e) => {
        if (e) {
          onChange(e);
        }
      }}
      multiple
    >
      <div className="flex w-full gap-4 mb-4 flex-wrap">
        <div className="">
          <InputBase
            startIcon={<Add />}
            required={false}
            disabled={
              !options.length || options.every((e) => value?.includes(e))
            }
            label={label}
            as={ComboboxInput}
            type="text"
            autoComplete="off"
            placeholder="book, change"
          />
        </div>
        <div
          style={{
            overflow: "auto",
            flex: 1,
            minWidth: "50%",
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          {value?.map((e) => (
            <ButtonBase
              className="text-primary border-grey-500 border mb-2 active:bg-primaryHover"
              variant="outlined"
              style={{
                padding: 4,
                fontWeight: 400,
                fontSize: 12,
                paddingRight: 8,
                marginRight: 4,
                paddingLeft: 8,
              }}
              onClick={() => {
                onChange(value?.filter((f) => e != f) ?? []);
              }}
            >
              {e}
              <CloseCircle
                className="inline-block ml-2 text-red-500"
                size={16}
              />
            </ButtonBase>
          ))}
        </div>
      </div>
      <ComboboxOptions
        anchor="bottom"
        className="border empty:invisible w-56 bg-white shadow-md mt-1"
      >
        {options.map((e) => (
          <ComboboxOption
            key={e}
            value={e}
            className="data-[focus]:bg-blue-100 p-2 aria-selected:hidden"
          >
            {e}
          </ComboboxOption>
        ))}
      </ComboboxOptions>
    </Combobox>
  );
}
