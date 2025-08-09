import { ModelPropsFromSchema } from "@common/data/fields.mjs";
import { BasePackageSchema, PackageAuthorSchema, PackageLanguageSchema, PackageCompatibilitySchema, PackageRelationshipsSchema, RelatedPackageSchema } from "./base-package.mjs";

export type PackageAuthorData = ModelPropsFromSchema<PackageAuthorSchema>;
export type PackageLanguageData = ModelPropsFromSchema<PackageLanguageSchema>;
export type PackageManifestData = ModelPropsFromSchema<BasePackageSchema>;
export type PackageCompatibilityData = ModelPropsFromSchema<PackageCompatibilitySchema>;
export type PackageRelationshipsData = ModelPropsFromSchema<PackageRelationshipsSchema>;
export type DocumentTypesConfiguration = Record<string, Record<string, object>>;
export type RelatedPackageData = ModelPropsFromSchema<RelatedPackageSchema>;

