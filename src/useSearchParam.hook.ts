import {useHistory, useLocation} from "react-router-dom";
import {useCallback, useMemo} from "react";
import {useEvent} from "./useEvent.hook.ts";
import {useLatest} from "./useLatest.hook.ts";

type SearchParamOptions<ExpectedType, DefaultValue> = {
  defaultValue?: DefaultValue,
  serialize?: (value: ExpectedType) => string,
  deserialize?: (value: string) => ExpectedType
}

type SearchParamReturnValue<ExpectedType> = [ExpectedType | undefined, DispatchQueryChange<SetQueryAction<ExpectedType>>]

type Clearable<T> = '' | null | T;

type DispatchQueryChange<Payload> = (value: Clearable<Payload>) => void;
type SetQueryAction<ExpectedType> = ((prevValue?: ExpectedType) => ExpectedType) | ExpectedType
const isSimpleInput = <ExpectedType>(input: SetQueryAction<ExpectedType>): input is ExpectedType => {
  return typeof input !== 'function';
}

const isApplicableInput = <Payload>(input: Clearable<Payload>): input is Payload => {
  if (typeof input === 'string' && input.trim().length === 0) {
    return false;
  }

  return input !== null;
}

export function useSearchParam<
  ExpectedType,
  Key extends string = string,
  DefaultValue extends ExpectedType = ExpectedType
>(
  key: Key, options?: SearchParamOptions<ExpectedType, DefaultValue>
): SearchParamReturnValue<ExpectedType> {
  const {
    defaultValue,
    serialize,
    deserialize
  } = options || {};

  const {search, pathname} = useLocation();
  const history = useHistory();

  const defaultSerialize = useCallback((value: ExpectedType) => encodeURI(value as string), [])
  const defaultDeserialize = useCallback((value: string) => decodeURI(value) as ExpectedType, [])

  const innerSerialize = useEvent(serialize ?? defaultSerialize);
  const innerDeserialize = useEvent(deserialize ?? defaultDeserialize);

  const value = useMemo(() => {
    const queryParams = new URLSearchParams(search);
    const rawValue = queryParams.get(key);

    if (!rawValue) return defaultValue;

    return innerDeserialize(rawValue)
  }, [defaultValue, innerDeserialize, key, search]);

  const latestValue = useLatest(value);

  const updateValue = useCallback<DispatchQueryChange<SetQueryAction<ExpectedType>>>((input) => {
    const currentSearch = new URLSearchParams(search);

    if (!isApplicableInput(input)) {
      const params = new URLSearchParams({...Object.fromEntries(currentSearch)});
      params.delete(key);
      history.replace({pathname, search: params.toString()});
      return;
    }

    const innerInput = isSimpleInput(input) ? input : input(latestValue.current);

    const params = new URLSearchParams({...Object.fromEntries(currentSearch), [key]: innerSerialize(innerInput)});
    history.replace({pathname, search: params.toString()});
  }, [latestValue, history, innerSerialize, key, pathname, search]);

  return [value, updateValue]
}
