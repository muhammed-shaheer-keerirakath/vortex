export default async () => {
  return {
    // @ts-ignore
    'contracts/1_IERC_20.sol': (await import('raw-loader!./contracts/1_IERC_20.sol')).default,
    // @ts-ignore
    'contracts/2_ERC_20.sol': (await import('raw-loader!./contracts/2_ERC_20.sol')).default,
    // @ts-ignore
    'contracts/3_MyToken.sol': (await import('raw-loader!./contracts/3_MyToken.sol')).default,
    // @ts-ignore
    'scripts/deploy_with_web3.ts': (await import('!!raw-loader!./scripts/deploy_with_web3.ts')).default,
    // @ts-ignore
    'scripts/web3-lib.ts': (await import('!!raw-loader!./scripts/web3-lib.ts')).default,
    // @ts-ignore
    'tests/MyToken_test.sol': (await import('raw-loader!./tests/MyToken_test.sol')).default,
    // @ts-ignore
    'tests/storage.test.js': (await import('!!raw-loader!./tests/storage.test.js')).default,
    // @ts-ignore
    'README.txt': (await import('raw-loader!./README.txt')).default,
    // @ts-ignore
    '.prettierrc.json': (await import('raw-loader!./.prettierrc')).default,
  }
}
