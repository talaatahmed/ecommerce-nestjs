import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductDocument, UserType } from 'src/db/models';
import { CategoryRepository, ProductRepository } from 'src/db/repository';
import { uploadManyFilesOnCloudinary } from 'src/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import Redis from 'ioredis';
@Injectable()
export class ProductService {
  private redis = new Redis('redis://localhost:6379');
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly productRepository: ProductRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  async create(
    body: ProductDocument,
    user: UserType,
    files: Express.Multer.File[],
  ) {
    const {
      title,
      overview,
      price,
      discount,
      stock,
      category,
      brand,
    }: ProductDocument = body;

    const categoryData = await this.categoryRepository.findOneDocument(
      {
        _id: category,
      },
      {},
      { populate: { path: 'brands', select: 'name slug' } },
    );
    if (!categoryData) throw new NotFoundException('Category not Found');

    const brandData = categoryData?.brands.find(
      ({ _id }) => _id.toString() === brand.toString(),
    );
    if (!brandData) throw new NotFoundException('Brand not Found');

    let uploadResult;
    let images: string[] = [];
    console.log(files);
    if (files) {
      const filesPaths: string[] = files.map((file) => file.path);
      uploadResult = await uploadManyFilesOnCloudinary(filesPaths, {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        folder: `ECOMMERCE_App/${user._id}/Product`,
        resource_type: 'image',
        use_filename: true,
        unique_filename: true,
      });
      images = uploadResult.map(({ public_id }) => public_id);
    }

    const product = await this.productRepository.createDocument({
      title,
      overview,
      price,
      discount,
      stock,
      category,
      brand,
      createdBy: user._id,
      images,
    });
    return { product, uploadResult };

    //return 'This action adds a new product';
  }

  async listAllProducts() {
    //const products = await this.productRepository.findDocuments({}, {}, {});

    const products = await this.cacheManager.get('products');
    //const products = await this.redis.get('products');

    if (!products) {
      console.log('prodeuct form DB');

      const dbProducts = await this.productRepository.findDocuments({});

      await this.cacheManager.set('products', dbProducts, 2000);
      //await this.redis.set('products', JSON.stringify(dbProducts));

      return dbProducts;
    }

    console.log('prodeuct form Cache');
    return products;
    //return JSON.parse(products);
  }
}
