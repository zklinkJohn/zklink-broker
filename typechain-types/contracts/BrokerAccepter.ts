/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../common";

export interface BrokerAccepterInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "ACCEPT_ERC20"
      | "ACCEPT_ETH"
      | "BROKER_ROLE"
      | "DEFAULT_ADMIN_ROLE"
      | "FUND_ROLE"
      | "WITNESS_ROLE"
      | "acceptDefaultAdminTransfer"
      | "acceptERC20"
      | "acceptETH"
      | "approveZkLink"
      | "batchAccept"
      | "batchAcceptERC20"
      | "batchAcceptETH"
      | "beginDefaultAdminTransfer"
      | "cancelDefaultAdminTransfer"
      | "changeDefaultAdminDelay"
      | "changeZkLinkInstance"
      | "defaultAdmin"
      | "defaultAdminDelay"
      | "defaultAdminDelayIncreaseWait"
      | "dynamicCall"
      | "getRoleAdmin"
      | "grantBrokerRole"
      | "grantFundRole"
      | "grantRole"
      | "grantWitnessRole"
      | "hasRole"
      | "multicall"
      | "owner"
      | "pendingDefaultAdmin"
      | "pendingDefaultAdminDelay"
      | "renounceRole"
      | "revokeRole"
      | "rollbackDefaultAdminDelay"
      | "supportsInterface"
      | "withdraw"
      | "withdrawETH"
      | "zkLinkInstance"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "AcceptStatus"
      | "CallStatus"
      | "DefaultAdminDelayChangeCanceled"
      | "DefaultAdminDelayChangeScheduled"
      | "DefaultAdminTransferCanceled"
      | "DefaultAdminTransferScheduled"
      | "RoleAdminChanged"
      | "RoleGranted"
      | "RoleRevoked"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "ACCEPT_ERC20",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "ACCEPT_ETH",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "BROKER_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "FUND_ROLE", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "WITNESS_ROLE",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "acceptDefaultAdminTransfer",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "acceptERC20",
    values: [BytesLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "acceptETH",
    values: [BytesLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "approveZkLink",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "batchAccept",
    values: [BytesLike[], BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "batchAcceptERC20",
    values: [BytesLike[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "batchAcceptETH",
    values: [BytesLike[], BigNumberish[], BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "beginDefaultAdminTransfer",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "cancelDefaultAdminTransfer",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "changeDefaultAdminDelay",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "changeZkLinkInstance",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "defaultAdmin",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "defaultAdminDelay",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "defaultAdminDelayIncreaseWait",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "dynamicCall",
    values: [AddressLike, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getRoleAdmin",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantBrokerRole",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantFundRole",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "grantWitnessRole",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "hasRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "multicall",
    values: [BytesLike[]]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "pendingDefaultAdmin",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "pendingDefaultAdminDelay",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "revokeRole",
    values: [BytesLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "rollbackDefaultAdminDelay",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "withdrawETH",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "zkLinkInstance",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "ACCEPT_ERC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "ACCEPT_ETH", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "BROKER_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "DEFAULT_ADMIN_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "FUND_ROLE", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "WITNESS_ROLE",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "acceptDefaultAdminTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "acceptERC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "acceptETH", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "approveZkLink",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "batchAccept",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "batchAcceptERC20",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "batchAcceptETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "beginDefaultAdminTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "cancelDefaultAdminTransfer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeDefaultAdminDelay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "changeZkLinkInstance",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultAdminDelay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "defaultAdminDelayIncreaseWait",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "dynamicCall",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getRoleAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "grantBrokerRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "grantFundRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "grantRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "grantWitnessRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "hasRole", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "multicall", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "pendingDefaultAdmin",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "pendingDefaultAdminDelay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceRole",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "revokeRole", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "rollbackDefaultAdminDelay",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "withdrawETH",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "zkLinkInstance",
    data: BytesLike
  ): Result;
}

export namespace AcceptStatusEvent {
  export type InputTuple = [success: boolean, errorInfo: BytesLike];
  export type OutputTuple = [success: boolean, errorInfo: string];
  export interface OutputObject {
    success: boolean;
    errorInfo: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace CallStatusEvent {
  export type InputTuple = [success: boolean, errorInfo: BytesLike];
  export type OutputTuple = [success: boolean, errorInfo: string];
  export interface OutputObject {
    success: boolean;
    errorInfo: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DefaultAdminDelayChangeCanceledEvent {
  export type InputTuple = [];
  export type OutputTuple = [];
  export interface OutputObject {}
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DefaultAdminDelayChangeScheduledEvent {
  export type InputTuple = [
    newDelay: BigNumberish,
    effectSchedule: BigNumberish
  ];
  export type OutputTuple = [newDelay: bigint, effectSchedule: bigint];
  export interface OutputObject {
    newDelay: bigint;
    effectSchedule: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DefaultAdminTransferCanceledEvent {
  export type InputTuple = [];
  export type OutputTuple = [];
  export interface OutputObject {}
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace DefaultAdminTransferScheduledEvent {
  export type InputTuple = [
    newAdmin: AddressLike,
    acceptSchedule: BigNumberish
  ];
  export type OutputTuple = [newAdmin: string, acceptSchedule: bigint];
  export interface OutputObject {
    newAdmin: string;
    acceptSchedule: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleAdminChangedEvent {
  export type InputTuple = [
    role: BytesLike,
    previousAdminRole: BytesLike,
    newAdminRole: BytesLike
  ];
  export type OutputTuple = [
    role: string,
    previousAdminRole: string,
    newAdminRole: string
  ];
  export interface OutputObject {
    role: string;
    previousAdminRole: string;
    newAdminRole: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleGrantedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace RoleRevokedEvent {
  export type InputTuple = [
    role: BytesLike,
    account: AddressLike,
    sender: AddressLike
  ];
  export type OutputTuple = [role: string, account: string, sender: string];
  export interface OutputObject {
    role: string;
    account: string;
    sender: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface BrokerAccepter extends BaseContract {
  connect(runner?: ContractRunner | null): BrokerAccepter;
  waitForDeployment(): Promise<this>;

  interface: BrokerAccepterInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  ACCEPT_ERC20: TypedContractMethod<[], [string], "view">;

  ACCEPT_ETH: TypedContractMethod<[], [string], "view">;

  BROKER_ROLE: TypedContractMethod<[], [string], "view">;

  DEFAULT_ADMIN_ROLE: TypedContractMethod<[], [string], "view">;

  FUND_ROLE: TypedContractMethod<[], [string], "view">;

  WITNESS_ROLE: TypedContractMethod<[], [string], "view">;

  acceptDefaultAdminTransfer: TypedContractMethod<[], [void], "nonpayable">;

  acceptERC20: TypedContractMethod<
    [data: BytesLike, signature: BytesLike],
    [void],
    "nonpayable"
  >;

  acceptETH: TypedContractMethod<
    [data: BytesLike, amount: BigNumberish, signature: BytesLike],
    [void],
    "nonpayable"
  >;

  approveZkLink: TypedContractMethod<
    [contractAddress: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  batchAccept: TypedContractMethod<
    [data: BytesLike[], amounts: BigNumberish[], signature: BytesLike],
    [void],
    "nonpayable"
  >;

  batchAcceptERC20: TypedContractMethod<
    [data: BytesLike[], signature: BytesLike],
    [void],
    "nonpayable"
  >;

  batchAcceptETH: TypedContractMethod<
    [data: BytesLike[], amounts: BigNumberish[], signature: BytesLike],
    [void],
    "nonpayable"
  >;

  beginDefaultAdminTransfer: TypedContractMethod<
    [newAdmin: AddressLike],
    [void],
    "nonpayable"
  >;

  cancelDefaultAdminTransfer: TypedContractMethod<[], [void], "nonpayable">;

  changeDefaultAdminDelay: TypedContractMethod<
    [newDelay: BigNumberish],
    [void],
    "nonpayable"
  >;

  changeZkLinkInstance: TypedContractMethod<
    [newAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  defaultAdmin: TypedContractMethod<[], [string], "view">;

  defaultAdminDelay: TypedContractMethod<[], [bigint], "view">;

  defaultAdminDelayIncreaseWait: TypedContractMethod<[], [bigint], "view">;

  dynamicCall: TypedContractMethod<
    [contractAddress: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;

  getRoleAdmin: TypedContractMethod<[role: BytesLike], [string], "view">;

  grantBrokerRole: TypedContractMethod<
    [account: AddressLike],
    [void],
    "nonpayable"
  >;

  grantFundRole: TypedContractMethod<
    [account: AddressLike],
    [void],
    "nonpayable"
  >;

  grantRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  grantWitnessRole: TypedContractMethod<
    [account: AddressLike],
    [void],
    "nonpayable"
  >;

  hasRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [boolean],
    "view"
  >;

  multicall: TypedContractMethod<[data: BytesLike[]], [string[]], "nonpayable">;

  owner: TypedContractMethod<[], [string], "view">;

  pendingDefaultAdmin: TypedContractMethod<
    [],
    [[string, bigint] & { newAdmin: string; schedule: bigint }],
    "view"
  >;

  pendingDefaultAdminDelay: TypedContractMethod<
    [],
    [[bigint, bigint] & { newDelay: bigint; schedule: bigint }],
    "view"
  >;

  renounceRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  revokeRole: TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;

  rollbackDefaultAdminDelay: TypedContractMethod<[], [void], "nonpayable">;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  withdraw: TypedContractMethod<
    [token: AddressLike, to: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  withdrawETH: TypedContractMethod<
    [to: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;

  zkLinkInstance: TypedContractMethod<[], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "ACCEPT_ERC20"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "ACCEPT_ETH"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "BROKER_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "DEFAULT_ADMIN_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "FUND_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "WITNESS_ROLE"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "acceptDefaultAdminTransfer"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "acceptERC20"
  ): TypedContractMethod<
    [data: BytesLike, signature: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "acceptETH"
  ): TypedContractMethod<
    [data: BytesLike, amount: BigNumberish, signature: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "approveZkLink"
  ): TypedContractMethod<
    [contractAddress: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "batchAccept"
  ): TypedContractMethod<
    [data: BytesLike[], amounts: BigNumberish[], signature: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "batchAcceptERC20"
  ): TypedContractMethod<
    [data: BytesLike[], signature: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "batchAcceptETH"
  ): TypedContractMethod<
    [data: BytesLike[], amounts: BigNumberish[], signature: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "beginDefaultAdminTransfer"
  ): TypedContractMethod<[newAdmin: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "cancelDefaultAdminTransfer"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "changeDefaultAdminDelay"
  ): TypedContractMethod<[newDelay: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "changeZkLinkInstance"
  ): TypedContractMethod<[newAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "defaultAdmin"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "defaultAdminDelay"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "defaultAdminDelayIncreaseWait"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "dynamicCall"
  ): TypedContractMethod<
    [contractAddress: AddressLike, data: BytesLike],
    [void],
    "payable"
  >;
  getFunction(
    nameOrSignature: "getRoleAdmin"
  ): TypedContractMethod<[role: BytesLike], [string], "view">;
  getFunction(
    nameOrSignature: "grantBrokerRole"
  ): TypedContractMethod<[account: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "grantFundRole"
  ): TypedContractMethod<[account: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "grantRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "grantWitnessRole"
  ): TypedContractMethod<[account: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "hasRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "multicall"
  ): TypedContractMethod<[data: BytesLike[]], [string[]], "nonpayable">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "pendingDefaultAdmin"
  ): TypedContractMethod<
    [],
    [[string, bigint] & { newAdmin: string; schedule: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "pendingDefaultAdminDelay"
  ): TypedContractMethod<
    [],
    [[bigint, bigint] & { newDelay: bigint; schedule: bigint }],
    "view"
  >;
  getFunction(
    nameOrSignature: "renounceRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "revokeRole"
  ): TypedContractMethod<
    [role: BytesLike, account: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "rollbackDefaultAdminDelay"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<
    [token: AddressLike, to: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "withdrawETH"
  ): TypedContractMethod<
    [to: AddressLike, amount: BigNumberish],
    [boolean],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "zkLinkInstance"
  ): TypedContractMethod<[], [string], "view">;

  getEvent(
    key: "AcceptStatus"
  ): TypedContractEvent<
    AcceptStatusEvent.InputTuple,
    AcceptStatusEvent.OutputTuple,
    AcceptStatusEvent.OutputObject
  >;
  getEvent(
    key: "CallStatus"
  ): TypedContractEvent<
    CallStatusEvent.InputTuple,
    CallStatusEvent.OutputTuple,
    CallStatusEvent.OutputObject
  >;
  getEvent(
    key: "DefaultAdminDelayChangeCanceled"
  ): TypedContractEvent<
    DefaultAdminDelayChangeCanceledEvent.InputTuple,
    DefaultAdminDelayChangeCanceledEvent.OutputTuple,
    DefaultAdminDelayChangeCanceledEvent.OutputObject
  >;
  getEvent(
    key: "DefaultAdminDelayChangeScheduled"
  ): TypedContractEvent<
    DefaultAdminDelayChangeScheduledEvent.InputTuple,
    DefaultAdminDelayChangeScheduledEvent.OutputTuple,
    DefaultAdminDelayChangeScheduledEvent.OutputObject
  >;
  getEvent(
    key: "DefaultAdminTransferCanceled"
  ): TypedContractEvent<
    DefaultAdminTransferCanceledEvent.InputTuple,
    DefaultAdminTransferCanceledEvent.OutputTuple,
    DefaultAdminTransferCanceledEvent.OutputObject
  >;
  getEvent(
    key: "DefaultAdminTransferScheduled"
  ): TypedContractEvent<
    DefaultAdminTransferScheduledEvent.InputTuple,
    DefaultAdminTransferScheduledEvent.OutputTuple,
    DefaultAdminTransferScheduledEvent.OutputObject
  >;
  getEvent(
    key: "RoleAdminChanged"
  ): TypedContractEvent<
    RoleAdminChangedEvent.InputTuple,
    RoleAdminChangedEvent.OutputTuple,
    RoleAdminChangedEvent.OutputObject
  >;
  getEvent(
    key: "RoleGranted"
  ): TypedContractEvent<
    RoleGrantedEvent.InputTuple,
    RoleGrantedEvent.OutputTuple,
    RoleGrantedEvent.OutputObject
  >;
  getEvent(
    key: "RoleRevoked"
  ): TypedContractEvent<
    RoleRevokedEvent.InputTuple,
    RoleRevokedEvent.OutputTuple,
    RoleRevokedEvent.OutputObject
  >;

  filters: {
    "AcceptStatus(bool,bytes)": TypedContractEvent<
      AcceptStatusEvent.InputTuple,
      AcceptStatusEvent.OutputTuple,
      AcceptStatusEvent.OutputObject
    >;
    AcceptStatus: TypedContractEvent<
      AcceptStatusEvent.InputTuple,
      AcceptStatusEvent.OutputTuple,
      AcceptStatusEvent.OutputObject
    >;

    "CallStatus(bool,bytes)": TypedContractEvent<
      CallStatusEvent.InputTuple,
      CallStatusEvent.OutputTuple,
      CallStatusEvent.OutputObject
    >;
    CallStatus: TypedContractEvent<
      CallStatusEvent.InputTuple,
      CallStatusEvent.OutputTuple,
      CallStatusEvent.OutputObject
    >;

    "DefaultAdminDelayChangeCanceled()": TypedContractEvent<
      DefaultAdminDelayChangeCanceledEvent.InputTuple,
      DefaultAdminDelayChangeCanceledEvent.OutputTuple,
      DefaultAdminDelayChangeCanceledEvent.OutputObject
    >;
    DefaultAdminDelayChangeCanceled: TypedContractEvent<
      DefaultAdminDelayChangeCanceledEvent.InputTuple,
      DefaultAdminDelayChangeCanceledEvent.OutputTuple,
      DefaultAdminDelayChangeCanceledEvent.OutputObject
    >;

    "DefaultAdminDelayChangeScheduled(uint48,uint48)": TypedContractEvent<
      DefaultAdminDelayChangeScheduledEvent.InputTuple,
      DefaultAdminDelayChangeScheduledEvent.OutputTuple,
      DefaultAdminDelayChangeScheduledEvent.OutputObject
    >;
    DefaultAdminDelayChangeScheduled: TypedContractEvent<
      DefaultAdminDelayChangeScheduledEvent.InputTuple,
      DefaultAdminDelayChangeScheduledEvent.OutputTuple,
      DefaultAdminDelayChangeScheduledEvent.OutputObject
    >;

    "DefaultAdminTransferCanceled()": TypedContractEvent<
      DefaultAdminTransferCanceledEvent.InputTuple,
      DefaultAdminTransferCanceledEvent.OutputTuple,
      DefaultAdminTransferCanceledEvent.OutputObject
    >;
    DefaultAdminTransferCanceled: TypedContractEvent<
      DefaultAdminTransferCanceledEvent.InputTuple,
      DefaultAdminTransferCanceledEvent.OutputTuple,
      DefaultAdminTransferCanceledEvent.OutputObject
    >;

    "DefaultAdminTransferScheduled(address,uint48)": TypedContractEvent<
      DefaultAdminTransferScheduledEvent.InputTuple,
      DefaultAdminTransferScheduledEvent.OutputTuple,
      DefaultAdminTransferScheduledEvent.OutputObject
    >;
    DefaultAdminTransferScheduled: TypedContractEvent<
      DefaultAdminTransferScheduledEvent.InputTuple,
      DefaultAdminTransferScheduledEvent.OutputTuple,
      DefaultAdminTransferScheduledEvent.OutputObject
    >;

    "RoleAdminChanged(bytes32,bytes32,bytes32)": TypedContractEvent<
      RoleAdminChangedEvent.InputTuple,
      RoleAdminChangedEvent.OutputTuple,
      RoleAdminChangedEvent.OutputObject
    >;
    RoleAdminChanged: TypedContractEvent<
      RoleAdminChangedEvent.InputTuple,
      RoleAdminChangedEvent.OutputTuple,
      RoleAdminChangedEvent.OutputObject
    >;

    "RoleGranted(bytes32,address,address)": TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;
    RoleGranted: TypedContractEvent<
      RoleGrantedEvent.InputTuple,
      RoleGrantedEvent.OutputTuple,
      RoleGrantedEvent.OutputObject
    >;

    "RoleRevoked(bytes32,address,address)": TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;
    RoleRevoked: TypedContractEvent<
      RoleRevokedEvent.InputTuple,
      RoleRevokedEvent.OutputTuple,
      RoleRevokedEvent.OutputObject
    >;
  };
}
