import { yupResolver } from '@hookform/resolvers/yup'; // Dùng để tích hợp yup với react-hook-form
import omit from 'lodash/omit'; // Dùng để loại bỏ các thuộc tính không cần thiết từ một object
import { useForm } from 'react-hook-form'; // Hook để quản lý form và xử lý các hoạt động liên quan
import useQueryConfig from './useQueryConfig'; // Hook tuỳ chỉnh để lấy cấu hình query hiện tại
import { createSearchParams, useNavigate } from 'react-router-dom'; // Dùng để điều hướng và tạo query string trên URL
import { path } from 'src/constants'; // Đường dẫn tĩnh cho các route của ứng dụng
import getSchema, { Schema } from 'src/utils/schema'; // Hàm để lấy schema của form và kiểu dữ liệu cho schema

// Định nghĩa kiểu dữ liệu cho form chỉ bao gồm trường 'name'
type FormData = Pick<Schema, 'name'>;

// Lấy schema chỉ chứa trường 'name' từ toàn bộ schema
const nameSchema = getSchema().pick(['name']);

export default function useSearchProducts() {
    // Lấy cấu hình query hiện tại từ URL
    const queryConfig = useQueryConfig();

    // Sử dụng react-hook-form để quản lý form, với các giá trị mặc định và sử dụng yupResolver để kiểm tra tính hợp lệ của form
    const { register, handleSubmit } = useForm<FormData>({
        defaultValues: {
            name: '', // Giá trị mặc định cho trường 'name'
        },
        resolver: yupResolver(nameSchema), // Kiểm tra tính hợp lệ của form dựa trên schema của yup
    });
    
    // Hook điều hướng để chuyển hướng người dùng tới một route khác
    const navigate = useNavigate();

    // Hàm xử lý khi người dùng submit form
    const onSubmitSearch = handleSubmit((data) => {
        // Tạo ra một object config mới chứa tất cả các giá trị query hiện tại, cộng thêm 'name' từ form
        const config = queryConfig.order
            ? omit(
                  {
                      ...queryConfig,
                      name: data.name, // Thêm 'name' vào config mới từ form input
                  },
                  ['order', 'sort_by'], // Nếu đã có 'order', loại bỏ 'order' và 'sort_by' khỏi config
              )
            : {
                  ...queryConfig,
                  name: data.name, // Nếu không có 'order', chỉ thêm 'name' vào config
              };
        
        // Điều hướng tới trang chủ và cập nhật URL với query string mới dựa trên config
        navigate({
            pathname: path.home, // Điều hướng tới trang chủ
            search: createSearchParams(config).toString(), // Tạo query string từ config và gắn vào URL
        });
    });

    // Trả về hàm onSubmitSearch và register để sử dụng trong component khác
    return { onSubmitSearch, register };
}
